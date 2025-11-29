'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import type { User } from '@/lib/auth';

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!user) return null;

  return (
    <nav 
      className="sticky top-0 z-10 backdrop-blur-sm" 
      style={{ 
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in oklch, var(--background) 80%, transparent)'
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <svg 
                className="w-6 h-6" 
                style={{ color: 'var(--primary)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
              <h1 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
                UOL Admission Assistant
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {user.name || user.email}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium transition-all hover:scale-105"
              style={{
                background: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
