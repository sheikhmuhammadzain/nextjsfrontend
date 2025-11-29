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
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ 
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <svg 
                className="w-7 h-7 text-white" 
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
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-lg tracking-tight">
                THE UNIVERSITY OF
              </div>
              <div className="text-white font-bold text-2xl tracking-wide">
                LAHORE
              </div>
            </div>
          </div>
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
