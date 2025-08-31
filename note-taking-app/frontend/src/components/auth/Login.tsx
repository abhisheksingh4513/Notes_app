import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';
import { validateEmail } from '../../utils/validation';
import './login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      const form = e.target as HTMLElement;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      const form = e.target as HTMLElement;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(formData);
      const form = e.target as HTMLElement;
      form.classList.add('success');
      setTimeout(() => navigate('/dashboard'), 300);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      const form = e.target as HTMLElement;
      form.classList.add('shake');
      setTimeout(() => form.classList.remove('shake'), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    setLoading(true);
    setError('');

    try {
      await googleLogin(credential);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
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
                  <span className="typed-text">Ideas that inspire...</span>
                  <span className="cursor">|</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Animated Pen */}
          <div className="animated-pen">✒️</div>
          
          {/* Hero Text */}
          <div className="hero-text">
            <h1 className="hero-title">Where Ideas Come Alive</h1>
            <p className="hero-subtitle">Transform fleeting thoughts into lasting memories with our beautiful digital notebook</p>
          </div>
        </div>
        
        {/* Right Side Login Card */}
        <div className="login-card">
          <div className="card-header">
            <h2 className="card-title">Sign in to your account</h2>
            <p className="card-subtitle">Welcome back! Please enter your details.</p>
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
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <div className="input-container has-toggle">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
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
            </div>
            
            <button
              type="submit"
              className={`signin-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Sign in'
              )}
            </button>
            
            <div className="divider">
              <span>Or continue with</span>
            </div>
            
            <div className="google-signin">
              <GoogleSignInButton 
                onSuccess={handleGoogleLogin} 
                onError={(error) => setError(error || 'Google sign-in failed')}
              />
            </div>
            
            <div className="signup-link">
              Don't have an account? 
              <Link to="/signup" className="link">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
