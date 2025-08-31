import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateOTP } from '../../utils/validation';
import './login.css';

const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, sendOTP } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const email = location.state?.email;

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      const notebook = document.querySelector('.notebook-3d') as HTMLElement;
      const pen = document.querySelector('.animated-pen') as HTMLElement;
      
      if (notebook) {
        notebook.style.transform = `perspective(800px) rotateY(${15 + (x - 50) / 10}deg) rotateX(${(y - 50) / 20}deg)`;
      }
      
      if (pen) {
        pen.style.transform = `translate(${(x - 50) / 20}px, ${(y - 50) / 20}px) rotate(${(x - 50) / 10}deg)`;
      }
    };

    const handleClick = (e: MouseEvent) => {
      createSparkle(e.clientX, e.clientY);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const createSparkle = (x: number, y: number) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      document.body.removeChild(sparkle);
    }, 600);
  };

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    // Timer for resend OTP
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft, email, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOTP(otp)) {
      setError('Please enter a valid 6-digit OTP');
      const form = e.target as HTMLElement;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOTP(email, otp);
      const form = e.target as HTMLElement;
      form.classList.add('success');
      setTimeout(() => navigate('/dashboard'), 300);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      const form = e.target as HTMLElement;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      await sendOTP(email);
      setSuccess('OTP sent successfully!');
      setTimeLeft(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!email) {
    return null;
  }

  return (
    <div className="login-container">
      {/* Background with gradient */}
      <div className="background-gradient">
        
        {/* Drifting Circles */}
        <div className="drifting-circle circle-1"></div>
        <div className="drifting-circle circle-2"></div>
        <div className="drifting-circle circle-3"></div>
        
        {/* Floating Emojis */}
        <div className="floating-emoji emoji-1">📧</div>
        <div className="floating-emoji emoji-2">🔐</div>
        <div className="floating-emoji emoji-3">✅</div>
        <div className="floating-emoji emoji-4">📱</div>
        <div className="floating-emoji emoji-5">⏰</div>
        
        {/* Left Side Animations */}
        <div className="left-side">
          {/* 3D Notebook */}
          <div className="notebook-3d">
            <div className="notebook-cover">
              <div className="spiral-binding">
                <div className="spiral"></div>
                <div className="spiral"></div>
                <div className="spiral"></div>
                <div className="spiral"></div>
                <div className="spiral"></div>
              </div>
              <div className="notebook-content">
                <div className="ruled-lines">
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
                <div className="typewriter-text">
                  <span className="typed-text">Verification code...</span>
                  <span className="cursor">|</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Animated Pen */}
          <div className="animated-pen">📧</div>
          
          {/* Hero Text */}
          <div className="hero-text">
            <h1 className="hero-title">Almost There!</h1>
            <p className="hero-subtitle">Check your email and enter the 6-digit verification code to complete your account setup</p>
          </div>
        </div>
        
        {/* Right Side OTP Card */}
        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Verify your email</h2>
            <p className="card-subtitle">We've sent a 6-digit code to</p>
            <p className="email-display">{email}</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <span>⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <span>✅</span>
                {success}
              </div>
            )}
            
            <div className="input-group">
              <div className="input-container">
                <span className="input-icon">🔐</span>
                <input
                  type="text"
                  value={otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit code"
                  className="form-input otp-input"
                  maxLength={6}
                  autoComplete="one-time-code"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className={`signin-button ${loading ? 'loading' : ''}`}
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Verify Email'
              )}
            </button>
            
            <div className="resend-section">
              <p className="resend-text">
                Didn't receive the code?{' '}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendLoading}
                    className="resend-button"
                  >
                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                  </button>
                ) : (
                  <span className="timer-text">
                    Resend in {formatTime(timeLeft)}
                  </span>
                )}
              </p>
            </div>
            
            <div className="back-link">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="back-button"
              >
                ← Back to signup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
