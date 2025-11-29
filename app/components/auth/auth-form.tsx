'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '@/lib/auth';

import Image from 'next/image';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Sign up
        await register(formData.name, formData.email, formData.password);
        router.push('/chat');
      } else {
        // Sign in
        const response = await login(formData.email, formData.password);
        if (response.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/chat');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src="/logo.webp"
            alt="University of Lahore"
            width={200}
            height={60}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mt-6" style={{ color: 'var(--foreground)' }}>
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mb-4 p-4 text-sm rounded-lg"
          style={{
            background: 'var(--destructive)',
            color: 'var(--destructive-foreground)',
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <input
              type="text"
              placeholder="Enter your name here"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required={mode === 'signup'}
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm font-medium focus:outline-none disabled:opacity-50 transition-all"
              style={{
                background: 'var(--input)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </div>
        )}

        <div>
          <input
            type="email"
            placeholder="Enter your email here"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm font-medium focus:outline-none disabled:opacity-50 transition-all"
            style={{
              background: 'var(--input)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password here"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={isLoading}
            className="w-full px-4 py-3 pr-12 text-sm font-medium focus:outline-none disabled:opacity-50 transition-all"
            style={{
              background: 'var(--input)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>

        {mode === 'login' && (
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{
                  accentColor: 'var(--primary)',
                }}
              />
              <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3.5 text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          style={{
            background: 'var(--foreground)',
            color: 'var(--background)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {mode === 'login' ? 'Signing In...' : 'Signing Up...'}
            </span>
          ) : (
            mode === 'login' ? 'Sign In' : 'Sign Up'
          )}
        </button>
      </form>

      {/* Toggle Mode */}
      <div className="mt-6 text-center">
        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          {mode === 'login' ? "You don't have an account? " : "Already have an account? "}
        </span>
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm font-semibold hover:underline"
          style={{ color: 'var(--primary)' }}
        >
          {mode === 'login' ? 'Sign Up' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}
