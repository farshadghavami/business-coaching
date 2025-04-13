import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Starting stream creation test...');
    
    const apiKey = process.env.DID_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ 
        status: 'error',
        message: 'API key is not configured',
      }, { status: 500 });
    }

    // 1. ایجاد استریم جدید
    const streamResponse = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_url: "https://create-images-results.d-id.com/DefaultPresenters/Gina_f/image.jpeg",
        driver_url: "bank://classics/driver-01",
        config: {
          stitch: true,
          streaming_mode: "websocket"
        }
      })
    });

    const streamData = await streamResponse.json();
    console.log('Stream creation response:', streamData);

    if (!streamResponse.ok) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Failed to create stream',
        details: streamData,
        statusCode: streamResponse.status
      }, { status: streamResponse.status });
    }

    // 2. تست ارسال متن به استریم
    const testMessage = {
      type: 'talk',
      provider: {
        type: 'microsoft',
        voice_id: 'fa-IR-DilaraNeural'
      },
      text: "سلام! این یک تست برای استریم است."
    };

    return NextResponse.json({
      status: 'success',
      message: 'Stream created successfully',
      streamId: streamData.id,
      sessionId: streamData.session_id,
      streamUrl: `wss://api.d-id.com/talks/streams/${streamData.id}?session_id=${streamData.session_id}`,
      testMessage: testMessage
    });

  } catch (error) {
    console.error('Stream creation test error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to test stream creation',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 