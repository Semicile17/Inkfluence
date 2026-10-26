import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Check, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext.jsx';
import { getApiError, getFieldErrors } from '../lib/api.js';
import AuthShell from '../components/auth/AuthShell.jsx';
import Button from '../components/ui/Button.jsx';

const strengthLabel = ['A little more', 'Getting there', 'Solid', 'Lovely and strong'];

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(4, score);
}

export default function Register() {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!authLoading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  const strength = useMemo(() => getStrength(form.password), [form.password]);

  const update = (field) => (event) => {
    const value = field === 'username' ? event.target.value.toLowerCase().replace(/\s/g, '') : event.target.value;
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: '', body: '' }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const data = await register(form);
      toast.success(data.message);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrors(getFieldErrors(error));
      toast.error(getApiError(error, 'Could not create your account'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Join the library"
      title={
        <>
          Make yourself <span className="mark">at home</span>.
        </>
      }
      subtitle="A free account, a clean page and a small corner of the internet that is actually yours."
      mode="register"
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-ink link-underline">
            Sign in here
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label">
              Your name
            </label>
            <input
              id="name"
              autoComplete="name"
              value={form.name}
              onChange={update('name')}
              placeholder="Maya Chen"
              className="input"
              required
            />
            {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="username" className="label">
              Username
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink/30">
                @
              </span>
              <input
                id="username"
                autoComplete="username"
                value={form.username}
                onChange={update('username')}
                placeholder="mayawrites"
                className="input pl-7"
                required
              />
            </div>
            {errors.username && <p className="mt-1.5 text-xs text-red-600">{errors.username}</p>}
          </div>
        </div>

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
            className="input"
            required
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password}
              onChange={update('password')}
              placeholder="At least 8 characters"
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
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2, 3].map((bar) => (
                  <span
                    key={bar}
                    className={`h-1 flex-1 rounded-full transition ${
                      strength > bar ? 'bg-lime-500' : 'bg-ink/10'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-ink/35">{strengthLabel[strength]}</span>
            </div>
          )}
          {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
        </div>

        {errors.body && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{errors.body}</p>}

        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Create my account
        </Button>

        <p className="flex items-start gap-2 text-[10px] leading-relaxed text-ink/35">
          <Check className="mt-0.5 h-3 w-3 shrink-0" />
          Free forever, no card needed. By joining you agree to keep it kind and
          credit other people’s words.
        </p>
      </form>
    </AuthShell>
  );
}
