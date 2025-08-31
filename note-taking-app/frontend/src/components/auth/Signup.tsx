import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword, validateName } from '../../utils/validation';
import './login.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, sendOTP } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors[0];
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const form = e.target as HTMLElement;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      // Send OTP after successful signup
      await sendOTP(formData.email);
      
      const form = e.target as HTMLElement;
      form.classList.add('success');
      setTimeout(() => navigate('/verify-otp', { state: { email: formData.email } }), 300);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      const form = e.target as HTMLElement;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background with gradient */}
      <div className="background-gradient">
        
        {/* Drifting Circles */}
        <div className="drifting-circle circle-1"></div>
        <div className="drifting-circle circle-2"></div>
        <div className="drifting-circle circle-3"></div>
        
        {/* Floating Emojis */}
        <div className="floating-emoji emoji-1">📝</div>
        <div className="floating-emoji emoji-2">💭</div>
        <div className="floating-emoji emoji-3">✨</div>
        <div className="floating-emoji emoji-4">📚</div>
        <div className="floating-emoji emoji-5">💡</div>
        
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
                  <span className="typed-text">Welcome aboard...</span>
                  <span className="cursor">|</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Animated Pen */}
          <div className="animated-pen">✒️</div>
          
          {/* Hero Text */}
          <div className="hero-text">
            <h1 className="hero-title">Join the Creative Journey</h1>
            <p className="hero-subtitle">Start capturing your brilliant ideas and turn them into something extraordinary with our intuitive note-taking platform</p>
          </div>
        </div>
        
        {/* Right Side Signup Card */}
        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Create your account</h2>
            <p className="card-subtitle">Start your creative journey today</p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <span>⚠️</span>
                {error}
              </div>
            )}
            
            <div className="input-group">
              <div className="input-container">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              {errors.name && (
                <div className="field-error">{errors.name}</div>
              )}
            </div>
            
            <div className="input-group">
              <div className="input-container">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              {errors.email && (
                <div className="field-error">{errors.email}</div>
              )}
            </div>
            
            <div className="input-group">
              <div className="input-container has-toggle">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    // Eye-off
                    <svg className="icon-eye" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M9.88 4.1A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 10.5 7.5a11.54 11.54 0 0 1-1.78 3.34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M6.19 6.19C4.23 7.36 2.73 9.18 1.5 11.5C2.73 15.89 7 19 12 19c1.18 0 2.32-.17 3.38-.49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    // Eye
                    <svg className="icon-eye" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="field-error">{errors.password}</div>
              )}
              <div className="password-hint">
                Must be at least 8 characters with uppercase, lowercase, number and special character
              </div>
            </div>
            
            <div className="input-group">
              <div className="input-container has-toggle">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? (
                    // Eye-off
                    <svg className="icon-eye" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M9.88 4.1A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 10.5 7.5a11.54 11.54 0 0 1-1.78 3.34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                      <path d="M6.19 6.19C4.23 7.36 2.73 9.18 1.5 11.5C2.73 15.89 7 19 12 19c1.18 0 2.32-.17 3.38-.49" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    // Eye
                    <svg className="icon-eye" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="field-error">{errors.confirmPassword}</div>
              )}
            </div>
            
            <button
              type="submit"
              className={`signin-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Create Account'
              )}
            </button>
            
            <div className="signup-link">
              Already have an account? 
              <Link to="/login" className="link">Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
