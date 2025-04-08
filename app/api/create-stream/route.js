export const runtime = 'edge';

export async function POST(request) {
  try {
    const apiKey = process.env.DID_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'DID API key not found' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const sourceUrl = body.source_url || 'https://i.ibb.co/1sN3B6D/avatar.jpg';

    // Validate source URL
    try {
      new URL(sourceUrl);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid source URL provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: sourceUrl,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('D-ID API Error:', errorText);
      return new Response(
        JSON.stringify({ error: `Failed to create stream: ${errorText}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Validate response data
    if (!data || !data.id || !data.session_id) {
      return new Response(
        JSON.stringify({ error: 'Invalid response from D-ID API' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating stream:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}