import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Starting D-ID stream test...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    
    // 1. اول یک talk معمولی ایجاد می‌کنیم
    console.log('Creating talk...');
    const talkResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_url: "s3://d-id-images-prod/google-oauth2|100025782809161419540/img_wtChCPbdHaqTma5unZPAr/sample.jpg",
        script: {
          type: "text",
          provider: {
            type: "microsoft",
            voice_id: "fa-IR-DilaraNeural"
          },
          input: "سلام! این یک تست است."
        }
      })
    });

    const talkData = await talkResponse.json();
    console.log('Talk creation response:', talkData);

    if (!talkResponse.ok) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Failed to create talk',
        details: talkData,
        statusCode: talkResponse.status
      }, { status: talkResponse.status });
    }

    // 2. حالا با ID تاک ایجاد شده، یک استریم می‌سازیم
    console.log('Creating stream for talk:', talkData.id);
    const streamResponse = await fetch(`https://api.d-id.com/talks/${talkData.id}/streams`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`,
        'Content-Type': 'application/json'
      }
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

    // 3. برگرداندن اطلاعات استریم
    const encodedKey = encodeURIComponent(apiKey);
    const streamUrl = `wss://api.d-id.com/talks/${talkData.id}/streams?authorization=${encodedKey}`;
    
    return NextResponse.json({
      status: 'success',
      message: 'Stream created successfully',
      talkId: talkData.id,
      streamId: streamData.id,
      streamUrl: streamUrl,
      details: {
        talk: talkData,
        stream: streamData
      }
    });

  } catch (error) {
    console.error('Stream test error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to create stream',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 