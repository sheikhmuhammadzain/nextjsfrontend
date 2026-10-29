'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChatInterface } from '@/app/components/chat-interface';

import { getAuthToken } from '@/lib/auth';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;
  const [chat, setChat] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    }
  }, [chatId]);

  const loadChat = async (chatId: string) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/agent/chats/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          setError('Chat not found');
        } else {
          setError('Failed to load chat');
        }
        return;
      }

      const data = await res.json();
      // Map id to _id for ChatInterface compatibility
      setChat({ ...data, _id: data.id });
    } catch (err) {
      console.error('Load chat error:', err);
      setError('Failed to load chat');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 mx-auto mb-4"
            style={{ color: 'var(--primary)' }}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <svg
            className="h-12 w-12 mx-auto mb-4"
            style={{ color: 'var(--destructive)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm mb-4" style={{ color: 'var(--foreground)' }}>{error}</p>
          <button
            onClick={() => router.push('/chat')}
            className="px-4 py-2 text-sm font-medium transition-all hover:scale-105"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            Start New Chat
          </button>
        </div>
      </div>
    );
  }

  return <ChatInterface initialChat={chat} />;
}
