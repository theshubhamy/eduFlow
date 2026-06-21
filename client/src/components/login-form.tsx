import * as React from 'react';
import { useState } from 'react';
import { useLogin } from '@/hooks/queries/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await loginMutation.mutateAsync({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('w-full max-w-sm mx-auto flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#F1F5F9]">
          Welcome back
        </h1>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
          Enter your credentials to access your dashboard
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-lg bg-[#FEE2E2] p-3 text-[#B91C1C] border border-[#FEE2E2] dark:bg-red-950/20 dark:border-red-950/30">
          <AlertCircle className="h-4 w-4 shrink-0 text-[#B91C1C]" />
          <span className="text-xs font-semibold">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@school.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
            autoComplete="email"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
              Password
            </Label>
            <span className="text-xs text-[#2563EB] hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
              className="pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] dark:text-[#64748B] dark:hover:text-[#94A3B8]"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-[#E5E7EB] dark:border-[#334155]"></div>
        <span className="flex-shrink mx-4 text-xs text-[#94A3B8] dark:text-[#64748B] uppercase tracking-wider font-semibold">
          or continue with
        </span>
        <div className="flex-grow border-t border-[#E5E7EB] dark:border-[#334155]"></div>
      </div>

      {/* Social Auth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="w-full h-10 border-[#E5E7EB] hover:bg-[#F8F9FA]" disabled={loading} type="button">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </Button>
        <Button variant="outline" className="w-full h-10 border-[#E5E7EB] hover:bg-[#F8F9FA]" disabled={loading} type="button">
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
            />
          </svg>
          GitHub
        </Button>
      </div>

      {/* Switch Link */}
      <p className="text-center text-sm text-[#64748B] dark:text-[#94A3B8]">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-[#2563EB] hover:underline font-semibold">
          Register School
        </Link>
      </p>

      {/* Tiny Footer */}
      <p className="text-center text-[10px] text-[#94A3B8] dark:text-[#64748B]">
        By clicking continue, you agree to our{' '}
        <span className="underline cursor-pointer">Terms of Service</span> and{' '}
        <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </div>
  );
}
