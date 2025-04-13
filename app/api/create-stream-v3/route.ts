import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Creating D-ID stream...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    
    // ایجاد stream
    const streamResponse = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_url: "s3://d-id-images-prod/google-oauth2|100025782809161419540/img_wtChCPbdHaqTma5unZPAr/sample.jpg",
        driver_url: "bank://classics/driver-01",
        config: {
          result_format: "mp4",
          stitch: true
        }
      })
    });

    const responseText = await streamResponse.text();
    console.log('Stream Response:', {
      status: streamResponse.status,
      body: responseText
    });

    if (!streamResponse.ok) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to create stream',
        details: responseText
      }, { status: streamResponse.status });
    }

    const streamData = JSON.parse(responseText);
    return NextResponse.json({
      status: 'success',
      stream: streamData
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 