import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  // Try Gmail with different port/security settings
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,     // 5 seconds
    socketTimeout: 10000       // 10 seconds
  });
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  // Build the HTML once
  const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Thank you for signing up for Notes App! Please use the following OTP to verify your email address:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #3b82f6; background-color: #e5f4ff; padding: 15px 25px; border-radius: 8px; letter-spacing: 8px;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #666; text-align: center;">
              This OTP will expire in 10 minutes.
            </p>
            <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
              If you didn't request this verification, please ignore this email.
            </p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #999;">
              © 2024 Notes App. All rights reserved.
            </p>
          </div>
        </div>
      `;

  // Try Brevo (Sendinblue) first if configured
  if (process.env.BREVO_API_KEY) {
    try {
      const https = await import('node:https');
      const data = JSON.stringify({
        sender: { email: process.env.EMAIL_FROM || 'noreply@notesapp.com', name: 'Notes App' },
        to: [{ email }],
        subject: 'Your OTP for Notes App Verification',
        htmlContent: htmlContent,
      });

      const options: any = {
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY as string,
          'Content-Length': Buffer.byteLength(data),
          'accept': 'application/json',
        },
      };

      const resBody: string = await new Promise((resolve, reject) => {
        const req = (https as any).request(options, (res: any) => {
          const chunks: Buffer[] = [];
          res.on('data', (d: Buffer) => chunks.push(d));
          res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
      });

      console.log('OTP sent via Brevo. Response:', resBody?.slice(0, 200));
      return;
    } catch (brevoErr: any) {
      console.error('Brevo send failed:', brevoErr?.message || brevoErr);
      // fall through to SMTP fallback
    }
  }

  // Fallback to SMTP transporter
  try {
    console.log('EMAIL_USER configured:', !!process.env.EMAIL_USER);

    const transporter = createTransporter();

    // Test connection (may throw on network/firewall issues)
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@notesapp.com',
      to: email,
      subject: 'Your OTP for Notes App Verification',
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent (SMTP):', info.messageId);

    // No preview URL for SMTP with real providers
  } catch (error: any) {
    console.error('Error sending OTP email:', error?.message || error);

    // In development, do not block signup — log OTP and continue
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Email sending failed; falling back to dev mode: logging OTP and continuing.');
      console.log(`DEV OTP for ${email}: ${otp}`);
      return; // swallow the error in dev so signup flow continues
    }

    // In production, propagate the failure
    throw new Error('Failed to send OTP email');
  }
};
