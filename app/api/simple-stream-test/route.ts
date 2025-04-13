import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Starting simple stream test...');
    const apiKey = process.env.DID_API_KEY;
    
    // استفاده از یک تصویر عمومی معتبر
    const sourceUrl = "https://raw.githubusercontent.com/did-samples/did-samples.github.io/main/assets/img/presents-f-1.jpg";

    const response = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_url: sourceUrl,
        driver_url: "bank://classics/driver-01",
        config: {
          stitch: true,
          streaming_mode: "websocket",
          result_format: "mp4"
        }
      })
    });

    const data = await response.json();
    console.log('Stream creation response:', data);

    if (!response.ok) {
      return NextResponse.json({ 
        success: false,
        error: data,
        statusCode: response.status
      }, { status: response.status });
    }

    // اگر موفقیت‌آمیز بود، اطلاعات استریم رو برمی‌گردونیم
    return NextResponse.json({
      success: true,
      streamId: data.id,
      sessionId: data.session_id,
      status: data.status,
      streamUrl: `wss://api.d-id.com/talks/streams/${data.id}?session_id=${data.session_id}`
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 