'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from './message';
import { ChatInput } from './chat-input';
import { AdmissionForm } from './admission-form';
import { AdmissionSuccess } from './admission-success';
import { getAuthToken } from '@/lib/auth';
import AITextLoading from './ai-text-loading';

interface ChatInterfaceProps {
  initialChat?: {
    _id: string;
    title: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string; sources?: any[] }>;
  };
}

export function ChatInterface({ initialChat }: ChatInterfaceProps = {}) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; sources?: any[] }>>(
    initialChat?.messages || []
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(initialChat?._id || null);

  // Admission State
  const [admissionSessionId, setAdmissionSessionId] = useState<string | null>(null);
  const [admissionStep, setAdmissionStep] = useState<string | null>(null);
  const [admissionFormData, setAdmissionFormData] = useState<any>(null);
  const [admissionResult, setAdmissionResult] = useState<any>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial chat messages
  useEffect(() => {
    if (initialChat) {
      setMessages(initialChat.messages);
      setCurrentChatId(initialChat._id);
    }
  }, [initialChat]);

  const handleMessageSubmit = async (query: string) => {
    if (!query.trim() || isStreaming) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: query };
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    setLoadingAction('thinking'); // General loading state

    // Add empty assistant message
    setMessages(prev => [...prev, { role: 'assistant' as const, content: '' }]);

    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          history: messages.slice(-5), // Send last 5 messages as context
          session_id: admissionSessionId,
          chat_id: currentChatId
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      // Check Content-Type to determine if it's JSON (Action) or Stream (Text)
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        // Handle Action Response (JSON)
        const data = await response.json();

        // Update chat ID if returned
        if (data.chat_id && !currentChatId) {
          setCurrentChatId(data.chat_id);
          window.history.pushState({}, '', `/chat/${data.chat_id}`);
        }

        if (data.type === 'action') {
          if (data.action === 'start_admission') {
            setAdmissionSessionId(data.data.session_id);
            setAdmissionStep(data.data.step);
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: data.data.message
              };
              return newMessages;
            });
          } else if (data.action === 'update_admission') {
            setAdmissionStep(data.data.step);
            if (data.data.data?.form_data) {
              setAdmissionFormData(data.data.data.form_data);
            }
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = {
                role: 'assistant',
                content: data.data.message
              };
              return newMessages;
            });
          }
        }
      } else {
        // Handle Stream Response (SSE)
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedContent = '';
        let sources: any[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6);
              try {
                const event = JSON.parse(data);

                if (event.type === 'intent') {
                  if (event.chat_id && !currentChatId) {
                    setCurrentChatId(event.chat_id);
                    window.history.pushState({}, '', `/chat/${event.chat_id}`);
                  }
                } else if (event.type === 'chunk' && event.text) {
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
                  // Handle sources
                  try {
                    sources = typeof event.sources === 'string' ? JSON.parse(event.sources) : event.sources;
                    setMessages(prev => {
                      const newMessages = [...prev];
                      const lastMsg = newMessages[newMessages.length - 1];
                      lastMsg.sources = sources;
                      return newMessages;
                    });
                  } catch (e) { console.warn('Failed to parse sources'); }
                }
              } catch (e) {
                console.warn('Failed to parse event:', e);
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        };
        return newMessages;
      });
    } finally {
      setIsStreaming(false);
      setLoadingAction(null);
    }
  };

  // Alias handleSubmit to handleMessageSubmit for backward compatibility
  const handleSubmit = handleMessageSubmit;

  const handleUpload = async (file: File) => {
    if (!admissionSessionId) {
      // Auto-start admission if they upload something
      try {
        const token = getAuthToken();
        if (!token) throw new Error('Not authenticated');

        // Start session first
        const startRes = await fetch('/api/admission/start', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const startData = await startRes.json();
        setAdmissionSessionId(startData.session_id);
        setAdmissionStep(startData.step);

        // Now upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('session_id', startData.session_id);

        // Add user message about upload
        setMessages(prev => [...prev, { role: 'user', content: `Uploaded: ${file.name}` }]);
        setIsStreaming(true);
        setLoadingAction('upload');

        const uploadRes = await fetch('/api/admission/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        const uploadData = await uploadRes.json();

        setMessages(prev => [...prev, { role: 'assistant', content: uploadData.message }]);
        setAdmissionStep(uploadData.step);

      } catch (e) {
        console.error(e);
        setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to upload document.' }]);
      } finally {
        setIsStreaming(false);
        setLoadingAction(null);
      }
      return;
    }

    // Existing session
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('session_id', admissionSessionId);

      setMessages(prev => [...prev, { role: 'user', content: `Uploaded: ${file.name}` }]);
      setIsStreaming(true);
      setLoadingAction('upload');

      const uploadRes = await fetch('/api/admission/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const uploadData = await uploadRes.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: uploadData.message,
        sources: uploadData.data?.rag_sources
      }]);
      setAdmissionStep(uploadData.step);

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to upload document.' }]);
    } finally {
      setIsStreaming(false);
      setLoadingAction(null);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (!admissionSessionId) return;

    try {
      const token = getAuthToken();
      setIsStreaming(true);

      const res = await fetch('/api/admission/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: admissionSessionId,
          form_data: data
        })
      });

      const resData = await res.json();

      setMessages(prev => [...prev, { role: 'assistant', content: resData.message }]);
      setAdmissionStep(resData.step);
      setAdmissionResult(resData.data); // Store result for success view
      setAdmissionFormData(null); // Clear form view

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to submit application.' }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStartNewApplication = () => {
    setAdmissionStep(null);
    setAdmissionSessionId(null);
    setAdmissionFormData(null);
    setAdmissionResult(null);
    setMessages(prev => [...prev, { role: 'assistant', content: 'You can start a new application anytime.' }]);
  };

  return (
    <div className="flex min-h-screen flex-col group" style={{ background: 'var(--background)' }}>
      {/* Chat Title (if loading existing chat) */}
      {initialChat && (
        <div className="sticky top-0 z-10" style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--background)'
        }}>
          <div className="mx-auto max-w-3xl px-6 py-3">
            <h2 className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
              {initialChat.title}
            </h2>
          </div>
        </div>
      )}

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
                <button
                  onClick={() => handleMessageSubmit('I want to apply for admission')}
                  className="px-5 py-3 text-sm font-medium transition-all hover:scale-[1.02] flex items-center justify-between group/btn"
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  <span>Start Admission Application</span>
                  <svg className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {messages.map((message, index) => (
                <Message key={index} message={message} />
              ))}

              {isStreaming && loadingAction === 'upload' && (
                <AITextLoading
                  texts={["Extracting details...", "Recommending degrees...", "Extracting scholarships..."]}
                />
              )}

              {isStreaming && loadingAction === 'select_program' && (
                <AITextLoading
                  texts={["Processing selection...", "Generating application form...", "Verifying eligibility..."]}
                />
              )}

              {isStreaming && loadingAction === 'start_admission' && (
                <AITextLoading
                  texts={["Initializing admission...", "Checking eligibility...", "Preparing session..."]}
                />
              )}

              <div ref={messagesEndRef} />

              {/* Admission Form */}
              {admissionStep === 'review_form' && admissionFormData && (
                <div className="mt-4 mb-8">
                  <AdmissionForm
                    initialData={admissionFormData}
                    onSubmit={handleFormSubmit}
                  />
                </div>
              )}

              {/* Admission Success Slip */}
              {admissionStep === 'submitted' && admissionResult && (
                <div className="mt-4 mb-8">
                  <AdmissionSuccess
                    applicationId={admissionResult.application_id}
                    formData={admissionResult.form_data}
                    onClose={handleStartNewApplication}
                  />
                </div>
              )}
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
          <ChatInput
            onSubmit={handleMessageSubmit}
            onUpload={handleUpload}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
