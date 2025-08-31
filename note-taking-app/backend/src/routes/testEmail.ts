// Test email configuration endpoint
import { Request, Response } from 'express';

export const testEmailConfig = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error('Email config test error:', error);
    res.status(500).json({ error: 'Email config test failed' });
  }
};
