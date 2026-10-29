'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ChatHistoryItem {
  id: string;
  title: string;
  messages: any[];
  updated_at: string;
}

import { getAuthToken } from '@/lib/auth';

export function ChatHistory() {
  const [chats, setChats] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/agent/chats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Delete this chat?')) return;

    try {
      const token = getAuthToken();
      const res = await fetch(`/api/agent/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setChats(chats.filter(chat => chat.id !== chatId));

        // If deleted chat is currently open, redirect to new chat
        if (window.location.pathname.includes(chatId)) {
          router.push('/chat');
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const startNewChat = () => {
    router.push('/chat');
    setIsOpen(false);
  };

  const openChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-20 z-50 p-3 transition-all hover:scale-105"
        style={{
          background: 'var(--background)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
        }}
        title="Chat History"
      >
        <svg
          className="h-5 w-5"
          style={{ color: 'var(--foreground)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bottom-0 z-50 w-80 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{
          background: 'var(--background)',
          borderRight: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
              Chat History
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-opacity-10"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={startNewChat}
              className="w-full px-4 py-3 text-sm font-medium transition-all hover:scale-[1.02]"
              style={{
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              + New Chat
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-6 w-6 mx-auto mb-2" style={{ color: 'var(--primary)' }}>
                  <svg fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Loading...</p>
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  No chat history yet
                </p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className="group relative p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.02]"
                  style={{
                    background: 'var(--secondary)',
                    border: '1px solid var(--border)',
                  }}
                  onClick={() => openChat(chat.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                        {chat.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        {chat.messages.length} messages · {new Date(chat.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity hover:bg-opacity-20"
                      style={{ color: 'var(--destructive)' }}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 mt-auto border-t border-gray-100">
            <button
              onClick={async () => {
                if (!confirm('Are you sure you want to delete ALL chat history? This action cannot be undone.')) return;

                try {
                  const token = getAuthToken();
                  const res = await fetch('/api/agent/chats', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                  });

                  if (res.ok) {
                    setChats([]);
                    router.push('/chat');
                  }
                } catch (error) {
                  console.error('Failed to clear history:', error);
                }
              }}
              className="flex w-full items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 rounded-lg"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All History
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
