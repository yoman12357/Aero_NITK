import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import logo from '../images/Aero_NITK_logo.png';
import './LoginPage.css';
import Footer from './footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // On success, redirect to admin dashboard or home
      navigate('/dashboard'); 
    } catch (err) {
      setError('Invalid email or password.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Read authorized emails from environment variable
  // Expected format in .env: VITE_ALLOWED_EMAIL=admin@aeronitk.in,other@gmail.com
  const allowedEmailsEnv = import.meta.env.VITE_ALLOWED_EMAIL || '';
  const ALLOWED_EMAILS = allowedEmailsEnv.split(',').map(email => email.trim());

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if the user's email is in the allowed list
      if (!ALLOWED_EMAILS.includes(user.email)) {
        await auth.signOut(); // Sign them out immediately
        throw new Error('Unauthorized email address.');
      }

      navigate('/dashboard');
    } catch (err) {
      if (err.message === 'Unauthorized email address.') {
        setError('Access Denied: Your email is not authorized.');
      } else {
        setError('Failed to sign in with Google.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="login-container">
      <div className="login-left">
        <div className="logo-container">
          <img src={logo} alt="Aero NITK Logo" className="logo-img" />
          <h1 className="logo-text">AERONITK</h1>
          <p className="logo-subtext">WINGS OF TEAMWORK</p>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">ADMIN LOGIN</h2>
          <p className="login-subtitle">Welcome ! Please login to continue.</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <User className="input-icon" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aeronitk.in" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* "Remember Me" Option - for future use */}
            {/* <div className="form-options">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
            </div> */}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <button 
              type="button" 
              className="google-login-btn" 
              onClick={handleGoogleLogin} 
              disabled={loading}
            >
              <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Sign in with Google
            </button>
            
            {/* forgot password functionality - for future use */}  
            {/* <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div> */}
          </form>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Login;
