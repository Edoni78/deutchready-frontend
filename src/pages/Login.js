import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as loginApi, verify, resendCode } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [step, setStep] = useState('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await loginApi(email, password);
      login(data.token, data.user);
      navigate(data.user.role === 'superadmin' ? '/dashboard' : from, { replace: true });
    } catch (err) {
      const res = err.response?.data;
      if (res?.requiresVerification && res?.email) {
        setStep('verify');
      } else {
        setError(res?.error || 'Login failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await verify(email, code);
      login(data.token, data.user);
      navigate(data.user.role === 'superadmin' ? '/dashboard' : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setDevCode('');
    setResending(true);
    try {
      const { data } = await resendCode(email);
      if (data.devCode) {
        setDevCode(data.devCode);
      } else {
        setError('');
        alert('Verification code sent. Check your email.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  if (step === 'verify') {
    return (
      <AuthLayout
        title="Verify your email"
        subtitle={
          <>
            We sent a 6-digit code to <strong className="text-stone-700">{email}</strong>
          </>
        }
      >
        {devCode && (
          <div className="mb-6 p-4 rounded-2xl bg-warm-50 border-2 border-warm-200">
            <p className="text-warm-800 text-sm font-medium">Your code (email not sent):</p>
            <p className="text-2xl font-mono font-bold text-warm-900 mt-1 tracking-widest">{devCode}</p>
          </div>
        )}
        <form onSubmit={handleVerify} className="space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
          )}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-stone-700 mb-2">Verification code</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              placeholder="000000"
              className="input-field text-center text-xl tracking-[0.4em]"
            />
          </div>
          <button type="submit" disabled={submitting || code.length !== 6} className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? 'Verifying...' : 'Verify & Log in'}
          </button>
        </form>
        <p className="mt-4 text-center text-stone-500 text-sm">
          Didn&apos;t receive it?{' '}
          <button type="button" onClick={handleResend} disabled={resending} className="text-brand-600 font-semibold hover:text-brand-700 disabled:opacity-50">
            {resending ? 'Sending...' : 'Resend code'}
          </button>
        </p>
        <p className="mt-2 text-center">
          <button type="button" onClick={() => setStep('form')} className="text-sm text-stone-400 hover:text-stone-600">
            ← Back to login
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue learning">
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="input-field"
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
          {submitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="mt-6 text-center text-stone-500 text-sm">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
