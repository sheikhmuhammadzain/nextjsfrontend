import { NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

async function handler(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  const path = params.path.join('/');
  const url = `${API_BASE_URL}/api/admission/${path}`;

  try {
    const contentType = request.headers.get('content-type');
    const authHeader = request.headers.get('authorization');
    
    const headers: Record<string, string> = {};
    if (authHeader) headers['Authorization'] = authHeader;
    // Do not set Content-Type for multipart/form-data, fetch will generate it with boundary
    if (contentType && !contentType.includes('multipart/form-data')) {
        headers['Content-Type'] = contentType;
    }

    let body: any;
    if (contentType?.includes('multipart/form-data')) {
        const formData = await request.formData();
        body = formData;
    } else {
        // For JSON/text, read as text
        const text = await request.text();
        if (text) body = text;
    }

    const response = await fetch(url, {
      method: request.method,
      headers: headers,
      body: body,
    });

    // Handle 204 No Content or empty responses
    const responseText = await response.text();
    let data = null;
    try {
        data = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
        console.error('Failed to parse backend response:', responseText);
        return new Response(JSON.stringify({ error: 'Invalid response from backend', detail: responseText }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', detail: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export { handler as GET, handler as POST };
