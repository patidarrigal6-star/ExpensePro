import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Specific credentials provided by the user
    const VALID_EMAIL = 'patidarrigal6@gmail.com';
    const VALID_PASSWORD = '123patidar098';

    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        onLoginSuccess();
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-wrapper mesh-gradient">
      <div className="login-container glass">
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon-wrapper">
              <LogIn size={28} />
            </div>
            <h1>Welcome Back</h1>
            <p className="text-muted">Enter your credentials to access your dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                className="input"
                placeholder="patidarrigal6@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                className="input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 ExpensePro • Secure Authentication</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
