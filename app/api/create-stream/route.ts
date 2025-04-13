import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.DID_API_KEY;
    if (!apiKey) {
      throw new Error('DID API key not found');
    }

    // Create talk first
    const talkResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: "https://avatars.githubusercontent.com/u/1?v=4",
        script: {
          type: "text",
          input: "Hello, this is a test!"
        }
      })
    });

    if (!talkResponse.ok) {
      const errorText = await talkResponse.text();
      console.error('Talk creation failed:', errorText);
      throw new Error(`Failed to create talk: ${errorText}`);
    }

    const talkData = await talkResponse.json();
    console.log('Talk created successfully:', talkData);

    // Create stream for the talk
    const streamResponse = await fetch(`https://api.d-id.com/talks/${talkData.id}/streams`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!streamResponse.ok) {
      const errorText = await streamResponse.text();
      console.error('Stream creation failed:', errorText);
      throw new Error(`Failed to create stream: ${errorText}`);
    }

    const streamData = await streamResponse.json();
    console.log('Stream created successfully:', streamData);

    // Validate stream response
    if (!streamData.id || !streamData.connection_details?.url) {
      console.error('Invalid stream response:', streamData);
      throw new Error('Invalid stream response format');
    }

    return NextResponse.json({
      id: streamData.id,
      wsUrl: streamData.connection_details.url,
      status: 'created'
    });

  } catch (error) {
    console.error('Stream creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
} 