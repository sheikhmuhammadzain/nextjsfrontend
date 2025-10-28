'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from './message';
import { ChatInput } from './chat-input';

export function ChatInterface() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; sources?: any[] }>>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (query: string) => {
    if (!query.trim() || isStreaming) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    // Add empty assistant message
    setMessages(prev => [...prev, { role: 'assistant' as const, content: '' }]);

    try {
      let accumulatedContent = '';
      let sources: any[] = [];

      // Call Route Handler instead of Server Action
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            
            try {
              const event = JSON.parse(data);
              
              if (event.type === 'chunk' && event.text) {
                accumulatedContent += event.text;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: accumulatedContent,
                  };
                  return newMessages;
                });
              } else if (event.type === 'complete' && event.sources) {
                try {
                  sources = typeof event.sources === 'string' 
                    ? JSON.parse(event.sources) 
                    : event.sources;
                } catch (e) {
                  console.warn('Failed to parse sources');
                }
                
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: accumulatedContent,
                    sources,
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.warn('Failed to parse event:', e, data);
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: 'Sorry, an error occurred. Please try again.',
        };
        return newMessages;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-sm" style={{ 
        borderBottom: '1px solid var(--border)',
        background: 'color-mix(in oklch, var(--background) 80%, transparent)'
      }}>
        <div className="mx-auto max-w-3xl px-6 py-4">
          <h1 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
            UOL Admission Assistant
          </h1>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-12">
          {messages.length === 0 ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full" style={{ 
                background: 'var(--accent)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <svg
                  className="h-8 w-8"
                  style={{ color: 'var(--accent-foreground)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="mb-3 text-2xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
                Ask about UOL programs
              </h2>
              <p className="max-w-md text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Get information about admissions, requirements, scholarships, and more.
              </p>
              <div className="mt-8 grid gap-3 text-left">
                <button
                  onClick={() => handleSubmit('What are the requirements for computer science?')}
                  className="px-5 py-3 text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{ 
                    background: 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  What are the requirements for computer science?
                </button>
                <button
                  onClick={() => handleSubmit('Tell me about scholarships for 90% marks')}
                  className="px-5 py-3 text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{ 
                    background: 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  Tell me about scholarships for 90% marks
                </button>
                <button
                  onClick={() => handleSubmit('What is the MBA program duration?')}
                  className="px-5 py-3 text-sm font-medium transition-all hover:scale-[1.02]"
                  style={{ 
                    background: 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  What is the MBA program duration?
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((message, index) => (
                <Message key={index} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input */}
      <div className="sticky bottom-0" style={{ 
        borderTop: '1px solid var(--border)',
        background: 'var(--background)'
      }}>
        <div className="mx-auto max-w-3xl px-6 py-4">
          <ChatInput onSubmit={handleSubmit} isStreaming={isStreaming} />
        </div>
      </div>
    </div>
  );
}
