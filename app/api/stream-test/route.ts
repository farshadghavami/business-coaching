import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('Starting D-ID stream test...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    const imageUrl = "https://raw.githubusercontent.com/did-samples/did-samples.github.io/main/assets/tom-cruise.jpg";
    
    // 1. ایجاد یک talk جدید
    console.log('Creating new talk...');
    const talkResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        script: {
          type: "text",
          provider: {
            type: "microsoft",
            voice_id: "fa-IR-DilaraNeural"
          },
          input: "سلام! این یک تست است."
        },
        source_url: imageUrl,
        driver_url: "bank://classics/driver-01"
      })
    });

    const talkResponseText = await talkResponse.text();
    console.log('Talk Response:', {
      status: talkResponse.status,
      body: talkResponseText
    });

    if (!talkResponse.ok) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to create talk',
        details: JSON.parse(talkResponseText)
      }, { status: talkResponse.status });
    }

    const talkData = JSON.parse(talkResponseText);

    // 2. منتظر می‌مانیم تا talk آماده شود
    console.log('Waiting for talk to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. ایجاد stream
    console.log('Creating stream...');
    const streamResponse = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_url: imageUrl,
        driver_url: "bank://classics/driver-01",
        config: {
          result_format: "mp4",
          stitch: true
        }
      })
    });

    const streamResponseText = await streamResponse.text();
    console.log('Stream Response:', {
      status: streamResponse.status,
      body: streamResponseText
    });

    let streamData;
    try {
      streamData = JSON.parse(streamResponseText);
    } catch (e) {
      console.error('Failed to parse stream response:', e);
      streamData = streamResponseText;
    }

    return NextResponse.json({
      status: streamResponse.status,
      talk: talkData,
      stream: streamData,
      requestDetails: {
        imageUrl,
        driverUrl: "bank://classics/driver-01"
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 