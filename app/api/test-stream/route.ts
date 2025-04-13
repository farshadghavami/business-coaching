import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const streamResponse = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic aWJjc2FsZXNhaUBnbWFpbC5jb20:1PG3Ib8MjjXHZJAwdgxcJ`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: imageUrl,
        driver_url: "bank://classics/driver-01",
        config: {
          stitch: true,
          streaming_mode: "websocket",
          result_format: "mp4"
        }
      })
    });

    const result = await streamResponse.json();
    console.log('Stream creation result:', result);

    if (!streamResponse.ok) {
      return NextResponse.json(
        { error: 'Stream creation failed', details: result },
        { status: streamResponse.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Stream test error:', error);
    return NextResponse.json(
      { error: 'Stream test failed', details: error.message },
      { status: 500 }
    );
  }
} 