import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiError, getFieldErrors } from '../lib/api.js';
import AuthShell from '../components/auth/AuthShell.jsx';
import Button from '../components/ui/Button.jsx';

export default function Login() {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  if (!authLoading && isAuthenticated) return <Navigate to={from} replace />;

  const update = (field) => (event) => {
    setForm((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const data = await login(form);
      toast.success(data.message);
      navigate(from, { replace: true });
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast.error(getApiError(error, 'Could not sign you in'));
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setDemoLoading(true);
    try {
      const data = await login({ email: 'demo@inkfluence.app', password: 'demo1234' });
      toast.success(`Taking you in, ${data.data.user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(getApiError(error, 'The demo account is having a moment. Try again.'));
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title={
        <>
          Good to see you <span className="mark">again</span>.
        </>
      }
      subtitle="Your drafts, reading list and favourite writers are exactly where you left them."
      mode="login"
      footer={
        <p>
          New to Inkfluence?{' '}
          <Link to="/register" className="font-semibold text-ink link-underline">
            Make yourself at home
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email || errors.body)}
            className="input"
            required
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="label mb-0">
              Password
            </label>
            <button
              type="button"
              onClick={demoLogin}
              disabled={demoLoading}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-ink/45 transition hover:text-ink"
            >
              {demoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              Use demo account
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.password}
              onChange={update('password')}
              placeholder="Your password"
              aria-invalid={Boolean(errors.password)}
              className="input pr-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/35 transition hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
        </div>

        {errors.body && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{errors.body}</p>}

        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Sign in
        </Button>
      </form>

      <div className="mt-5 rounded-2xl border border-ink/10 bg-paper/70 px-4 py-3">
        <p className="text-[11px] leading-relaxed text-ink/45">
          Just browsing? Use the demo account to poke around:{' '}
          <span className="font-medium text-ink/70">demo@inkfluence.app</span> /{' '}
          <span className="font-medium text-ink/70">demo1234</span>
        </p>
      </div>
    </AuthShell>
  );
}
