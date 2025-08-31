import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import userRoutes from './routes/user.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initDatabase } from './config/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
// Configure Helmet so OAuth popups and window.postMessage are not blocked by COOP
app.use(helmet({
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
   origin: "*",
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test email configuration
app.get('/api/test-email', (req, res) => {
  const hasEmailUser = !!process.env.EMAIL_USER;
  const hasEmailPass = !!process.env.EMAIL_PASS;
  const emailPassLength = process.env.EMAIL_PASS?.length || 0;
  
  console.log('Email config test:');
  console.log('EMAIL_USER exists:', hasEmailUser);
  console.log('EMAIL_USER value:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS exists:', hasEmailPass);
  console.log('EMAIL_PASS length:', emailPassLength);
  
  res.json({
    emailConfigured: hasEmailUser && hasEmailPass,
    emailUser: process.env.EMAIL_USER,
    emailPassLength: emailPassLength,
    message: 'Email configuration test completed'
  });
});

// Send a test OTP via current email pipeline (Brevo preferred)
app.get('/api/test-brevo', async (req, res) => {
  try {
    const to = (req.query.email as string) || process.env.EMAIL_USER || 'test@example.com';
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Use static import instead of dynamic import to avoid module issues
    const { sendOTPEmail } = await import('./services/emailService');
    await sendOTPEmail(to, otp);
    res.json({ ok: true, to, message: 'Test OTP sent via Brevo/SMTP (or logged in dev).', otp: process.env.NODE_ENV !== 'production' ? otp : undefined });
  } catch (err: any) {
    console.error('Test send error:', err?.message || err);
    res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
