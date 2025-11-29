'use client';

import { useState } from 'react';
import { AuthForm } from '@/app/components/auth/auth-form';
import Image from 'next/image';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/uolbg.jpg"
          alt="University of Lahore"
          fill
          className="absolute inset-0 object-cover"
          priority
        />
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%)',
          }}
        />
        
        {/* UOL Logo/Branding on Image */}
        <div className="absolute top-8 left-8 z-20">
           <Image
              src="/logo.webp"
              alt="University of Lahore"
              width={220}
              height={70}
              className="object-contain"
              priority
            />
        </div>

        {/* Info Text on Image */}
        <div className="absolute bottom-12 left-8 right-8 z-20 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Welcome to UOL Admission System
          </h2>
          <p className="text-lg opacity-90">
            Your gateway to quality education and a brighter future.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <AuthForm mode={mode} onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')} />
        </div>
      </div>
    </div>
  );
}
