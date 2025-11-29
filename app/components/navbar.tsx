'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import type { User } from '@/lib/auth';

import Image from 'next/image';

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
        borderBottom: '1px solid #333',
        background: '#000000'
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="University of Lahore"
                width={180}
                height={50}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm" style={{ color: '#ffffff' }}>
              {user.name || user.email}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium transition-all hover:scale-105"
              style={{
                background: '#333333',
                color: '#ffffff',
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
