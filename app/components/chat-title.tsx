'use client';

import { useState } from 'react';

interface ChatTitleProps {
  chatId: string | null;
  initialTitle?: string;
}

export function ChatTitle({ chatId, initialTitle }: ChatTitleProps) {
  const [title, setTitle] = useState(initialTitle || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const handleSave = async () => {
    if (!chatId || !editValue.trim()) return;

    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editValue }),
      });

      if (res.ok) {
        setTitle(editValue);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update title:', error);
    }
  };

  if (!chatId) return null;

  return (
    <div className="flex items-center gap-2 px-6 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') {
                setEditValue(title);
                setIsEditing(false);
              }
            }}
            className="flex-1 px-3 py-1 text-sm font-medium focus:outline-none"
            style={{
              background: 'var(--input)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-1 hover:scale-110 transition-transform"
            style={{ color: 'var(--primary)' }}
            title="Save"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={() => {
              setEditValue(title);
              setIsEditing(false);
            }}
            className="p-1 hover:scale-110 transition-transform"
            style={{ color: 'var(--muted-foreground)' }}
            title="Cancel"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </>
      ) : (
        <>
          <h2 className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
            {title || 'Untitled Chat'}
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
            style={{ color: 'var(--muted-foreground)' }}
            title="Edit title"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
