import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = React.memo(({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

                           const handleSubmit = (e) => {
                                 e.preventDefault();
                                 setError('');
                                 setLoading(true);

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
                                       <div className="login-container">
                                               <div className="login-header">
                                                         <div className="logo-icon-wrapper" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)' }}>
                                                                     <LogIn size={32} strokeWidth={2.5} />
                                                         </div>div>
                                                         <h1>Expense Pro</h1>h1>
                                                         <p className="text-muted">
                                                                     Enter your credentials to access your secure dashboard
                                                         </p>p>
                                               </div>div>
                                       
                                               <form onSubmit={handleSubmit} className="login-form">
                                                 {error && (
                                               <div className="login-error" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                                             <AlertCircle size={20} />
                                                             <span>{error}</span>span>
                                               </div>div>
                                                         )}
                                               
                                                         <div style={{ marginBottom: '1.5rem' }}>
                                                                     <label className="card-label" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem' }}>Email Address</label>label>
                                                                     <div style={{ position: 'relative' }}>
                                                                                   <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                                                   <input
                                                                                                     type="email"
                                                                                                     className="input"
                                                                                                     style={{ paddingLeft: '3rem' }}
                                                                                                     placeholder="patidarrigal6@gmail.com"
                                                                                                     value={email}
                                                                                                     onChange={(e) => setEmail(e.target.value)}
                                                                                                     required
                                                                                                   />
                                                                     </div>div>
                                                         </div>div>
                                               
                                                         <div style={{ marginBottom: '2.5rem' }}>
                                                                     <label className="card-label" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem' }}>Password</label>label>
                                                                     <div style={{ position: 'relative' }}>
                                                                                   <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                                                                   <input
                                                                                                     type="password"
                                                                                                     className="input"
                                                                                                     style={{ paddingLeft: '3rem' }}
                                                                                                     placeholder="********"
                                                                                                     value={password}
                                                                                                     onChange={(e) => setPassword(e.target.value)}
                                                                                                     required
                                                                                                   />
                                                                     </div>div>
                                                         </div>div>
                                               
                                                         <button type="submit" className="btn-premium btn-add" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                                                           {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                                                         </button>button>
                                               </form>form>
                                       
                                               <div className="login-footer" style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                                                         <p className="text-muted" style={{ fontSize: '0.75rem' }}>(c) 2026 Admin Panel | Secure Gateway</p>p>
                                               </div>div>
                                       </div>div>
                                 </div>div>
                               );
});

export default Login;
</div>
