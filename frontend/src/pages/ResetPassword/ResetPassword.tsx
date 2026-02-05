import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../../api';
import './ResetPassword.css';

export default function ResetPassword() {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uidb64 || !token) {
      setMessage({ type: 'error', text: 'Invalid reset link.' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setMessage(null);
    setLoading(true);
    try {
      await authApi.resetPassword({
        uidb64,
        token,
        password,
        confirm_password: confirmPassword,
      });
      setMessage({ type: 'success', text: 'Password reset successfully. You can now log in.' });
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Reset failed.' });
    } finally {
      setLoading(false);
    }
  }

  if (!uidb64 || !token) {
    return (
      <div className="auth-page">
        <div className="container auth-container">
          <div className="card auth-card">
            <h1>Invalid link</h1>
            <p className="auth-sub">Invalid or expired password reset link. Please request a new one.</p>
            <Link to="/admin/forgot-password" className="btn btn-primary">Request new link</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="card auth-card">
          <h1>Set new password</h1>
          <p className="auth-sub">Enter your new password below.</p>
          {message && (
            <div className={message.type === 'success' ? 'alert alert-success' : 'alert alert-error'}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="password">New password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="New password"
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirm">Confirm password</label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Confirm password"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Resetting…' : 'Reset password'}
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
