import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Starting simple D-ID stream creation...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    
    // ایجاد یک stream ساده
    const streamRequestBody = {
      source_url: "s3://d-id-images-prod/google-oauth2|100025782809161419540/img_wtChCPbdHaqTma5unZPAr/sample.jpg",
      driver_url: "bank://classics/driver-01"
    };

    console.log('Stream request:', {
      url: 'https://api.d-id.com/talks/streams',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: streamRequestBody
    });

    const createStreamResponse = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(streamRequestBody)
    });

    console.log('Stream response status:', createStreamResponse.status);
    const streamResponseText = await createStreamResponse.text();
    console.log('Stream response text:', streamResponseText);

    if (!createStreamResponse.ok) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to create stream',
        statusCode: createStreamResponse.status,
        response: streamResponseText
      }, { status: createStreamResponse.status });
    }

    let streamData;
    try {
      streamData = JSON.parse(streamResponseText);
      console.log('Stream data:', streamData);
    } catch (e) {
      console.error('Failed to parse stream response:', e);
      return NextResponse.json({
        status: 'error',
        message: 'Invalid stream response format',
        error: e instanceof Error ? e.message : 'Unknown error',
        rawResponse: streamResponseText
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'success',
      stream: streamData
    });

  } catch (error) {
    console.error('Stream creation error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create stream',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 