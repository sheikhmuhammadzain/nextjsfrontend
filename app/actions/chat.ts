'use server';

// Use 127.0.0.1 instead of localhost for better compatibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

interface StreamChunk {
  type: 'search_complete' | 'generation_start' | 'chunk' | 'complete' | 'error';
  text?: string;
  num_results?: number;
  sources?: any[];
  message?: string;
}

export async function* streamChat(query: string): AsyncGenerator<StreamChunk> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/query/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        top_k: 5,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
            const event: StreamChunk = JSON.parse(data);
            yield event;
          } catch (e) {
            console.warn('Failed to parse event:', e, data);
          }
        }
      }
    }
  } catch (error) {
    console.error('Stream error:', error);
    yield {
      type: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
