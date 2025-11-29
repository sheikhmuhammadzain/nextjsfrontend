'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
    sources?: any[];
  };
}

export function Message({ message }: MessageProps) {
  return (
    <div className="group relative">
      <div className="flex gap-4 items-start">
        {/* Avatar */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{
          background: message.role === 'user' ? '#000000' : 'var(--primary)',
          color: '#ffffff'
        }}>
          {message.role === 'user' ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2 overflow-hidden">
          {message.role === 'user' ? (
            <div
              className="inline-block px-5 py-2.5 rounded-2xl rounded-tl-none text-sm leading-relaxed font-medium"
              style={{
                background: '#000000',
                color: '#ffffff',
                marginTop: '0px'
              }}
            >
              {message.content}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none pt-2">
              {message.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'var(--primary)' }}></span>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.2s]" style={{ background: 'var(--primary)' }}></span>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full [animation-delay:0.4s]" style={{ background: 'var(--primary)' }}></span>
                </span>
              )}
            </div>
          )}

          {/* Sources */}
          {(() => {
            let sources = message.sources;
            if (typeof sources === 'string') {
              try {
                sources = JSON.parse(sources);
              } catch (e) {
                sources = [];
              }
            }
            if (!Array.isArray(sources)) sources = [];

            if (sources.length === 0) return null;

            return (
              <div className="mt-4 p-4" style={{
                background: 'var(--muted)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)'
              }}>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                  Sources
                </div>
                <div className="space-y-2">
                  {sources.slice(0, 3).map((source: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs" style={{ color: 'var(--foreground)' }}>
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="flex-1 truncate font-medium">{source.source}</span>
                      <span className="font-mono font-semibold" style={{ color: 'var(--primary)' }}>
                        {Math.round(source.score * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
