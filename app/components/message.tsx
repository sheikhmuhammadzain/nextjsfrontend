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
  const isUser = message.role === 'user';

  return (
    <div className={`group relative flex gap-4 items-start animate-in fade-in slide-in-from-bottom-4 duration-500 ${isUser ? 'flex-row-reverse' : ''}`}>

      {/* Avatar */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm border ${isUser
        ? 'bg-zinc-900 text-white border-zinc-800'
        : 'bg-white text-orange-600 border-gray-100'
        }`}>
        {isUser ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-hidden space-y-2 ${isUser ? 'flex justify-end' : ''}`}>

        {/* Message Bubble/Text */}
        <div className={
          isUser
            ? 'inline-block px-4 py-2 rounded-xl bg-zinc-900 text-white shadow-md text-sm leading-relaxed max-w-[85%]'
            : 'prose prose-sm prose-slate prose-p:leading-relaxed prose-li:marker:text-orange-500 max-w-none pt-1'
        }>
          {isUser ? (
            message.content
          ) : (
            <>
              {message.content ? (
                <div className="text-gray-800">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-2xl font-bold tracking-tight text-gray-900 mt-6 mb-4" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-xl font-semibold tracking-tight text-gray-900 mt-5 mb-3" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2" {...props} />,
                      p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-7" {...props} />,
                      ul: ({ node, ...props }) => <ul className="my-4 space-y-2 list-disc pl-5 text-gray-700" {...props} />,
                      ol: ({ node, ...props }) => <ol className="my-4 space-y-2 list-decimal pl-5 text-gray-700" {...props} />,
                      li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                      a: ({ node, ...props }) => <a className="text-orange-600 hover:text-orange-700 underline underline-offset-4 decoration-orange-200" {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-orange-200 pl-4 italic text-gray-600 my-4" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="h-2 w-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-orange-500 rounded-full animate-bounce"></span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sources (Chunks) */}
        {!isUser && message.sources && (
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {(() => {
              let sources = message.sources;
              if (typeof sources === 'string') {
                try { sources = JSON.parse(sources); } catch (e) { sources = []; }
              }
              if (!Array.isArray(sources)) sources = [];
              return sources.slice(0, 4).map((source: any, idx: number) => (
                <div
                  key={idx}
                  className="group/source flex flex-col gap-0.5 p-2 rounded-lg bg-gray-50 border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-default"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Source {idx + 1}</span>
                    <span className="text-[9px] font-mono font-medium text-orange-600 bg-orange-100 px-1 py-0 rounded-md">
                      {Math.round(source.score * 100)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 font-medium line-clamp-2 leading-tight">
                    {source.content || source.text || source.source}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
