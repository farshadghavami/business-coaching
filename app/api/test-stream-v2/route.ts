import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Testing D-ID stream creation...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    
    // 1. ابتدا یک talk ایجاد می‌کنیم
    const talkResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_url: "s3://d-id-images-prod/google-oauth2|100025782809161419540/img_wtChCPbdHaqTma5unZPAr/sample.jpg",
        script: {
          type: "text",
          input: "این یک تست است"
        }
      })
    });

    if (!talkResponse.ok) {
      const errorText = await talkResponse.text();
      console.error('Talk creation failed:', errorText);
      return NextResponse.json({ 
        status: 'error',
        message: 'Talk creation failed',
        details: errorText
      }, { status: talkResponse.status });
    }

    const talk = await talkResponse.json();
    console.log('Talk created:', talk);

    // 2. منتظر می‌مانیم تا talk آماده شود
    const talkId = talk.id;
    let talkStatus = talk.status;
    
    while (talkStatus !== 'done' && talkStatus !== 'error') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.d-id.com/talks/${talkId}`, {
        headers: {
          'Authorization': `Basic ${apiKey}`
        }
      });
      
      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Status check failed:', errorText);
        return NextResponse.json({ 
          status: 'error',
          message: 'Status check failed',
          details: errorText
        }, { status: statusResponse.status });
      }

      const statusData = await statusResponse.json();
      talkStatus = statusData.status;
      console.log('Talk status:', talkStatus);
    }

    if (talkStatus === 'error') {
      return NextResponse.json({ 
        status: 'error',
        message: 'Talk processing failed'
      }, { status: 500 });
    }

    // 3. حالا یک stream ایجاد می‌کنیم
    const streamResponse = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_url: "s3://d-id-images-prod/google-oauth2|100025782809161419540/img_wtChCPbdHaqTma5unZPAr/sample.jpg",
        driver_url: "bank://classics/driver-01"
      })
    });

    if (!streamResponse.ok) {
      const errorText = await streamResponse.text();
      console.error('Stream creation failed:', errorText);
      return NextResponse.json({ 
        status: 'error',
        message: 'Stream creation failed',
        details: errorText
      }, { status: streamResponse.status });
    }

    const stream = await streamResponse.json();
    console.log('Stream created:', stream);

    return NextResponse.json({
      status: 'success',
      talk,
      stream
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 