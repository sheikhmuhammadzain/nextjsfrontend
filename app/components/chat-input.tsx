'use client';

import { useState, useRef, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSubmit: (query: string) => void;
  onUpload?: (file: File) => void;
  isStreaming: boolean;
}

export function ChatInput({ onSubmit, onUpload, isStreaming }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || isStreaming) return;
    onSubmit(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUpload) {
      onUpload(e.target.files[0]);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="relative mx-auto w-full">
      <div
        className="group relative flex items-end gap-2 rounded-[24px] bg-white border border-gray-200 shadow-sm p-1.5 pl-3 transition-all focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-200 focus-within:shadow-md"
      >
        {/* Upload Button */}
        {onUpload && (
          <div className="pb-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,.pdf"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isStreaming}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors tooltip tooltip-top"
              title="Upload document"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          disabled={isStreaming}
          rows={1}
          className="flex-1 max-h-[150px] bg-transparent py-2.5 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none resize-none"
          style={{ lineHeight: '1.4' }}
        />

        {/* Send Button */}
        <div className="pb-1 pr-1">
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isStreaming}
            className={`
              flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all duration-200
              ${(!input.trim() || isStreaming)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-600 text-white hover:bg-orange-700 hover:scale-105 active:scale-95 shadow-orange-200'
              }
            `}
          >
            {isStreaming ? (
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-4 w-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
