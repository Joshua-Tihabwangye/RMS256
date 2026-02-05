import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setMessage({ type: 'success', text: 'Password reset link has been sent to your email.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Request failed.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="card auth-card">
          <h1>Reset Password</h1>
          <p className="auth-sub">Enter your email address to receive a password reset link.</p>
          {message && (
            <div className={message.type === 'success' ? 'alert alert-success' : 'alert alert-error'}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your email"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Sending…' : 'Submit'}
            </button>
          </form>
          <p className="auth-footer">
            <Link to="/admin/login">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
