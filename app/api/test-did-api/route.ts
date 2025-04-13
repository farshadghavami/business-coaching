import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('Testing D-ID API with curl-like request...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    const encodedKey = Buffer.from(apiKey).toString('base64');

    // تست ایجاد talk با فرمت مشابه cURL
    const talkData = {
      script: {
        type: "text",
        input: "Hello",
        provider: {
          type: "microsoft",
          voice_id: "en-US-JennyNeural"
        }
      },
      config: {
        result_format: "mp4"
      },
      source_url: "https://raw.githubusercontent.com/did-developer-community/image-samples/main/speaking-man.jpeg"
    };

    console.log('Request data:', JSON.stringify(talkData, null, 2));
    console.log('Using Basic Auth with encoded key:', encodedKey);

    const talkResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': `Basic ${encodedKey}`
      },
      body: JSON.stringify(talkData)
    });

    // لاگ کردن اطلاعات درخواست و پاسخ
    console.log('Request headers:', {
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': `Basic ${encodedKey}`
    });
    
    console.log('Response status:', talkResponse.status);
    console.log('Response headers:', Object.fromEntries(talkResponse.headers.entries()));
    
    const responseText = await talkResponse.text();
    console.log('Raw response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('Parsed response:', responseData);
    } catch (e) {
      console.error('Failed to parse response:', e);
      responseData = responseText;
    }

    return NextResponse.json({
      status: talkResponse.ok ? 'success' : 'error',
      request: {
        url: 'https://api.d-id.com/talks',
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'authorization': 'Basic [HIDDEN]'
        },
        data: talkData
      },
      response: {
        status: talkResponse.status,
        headers: Object.fromEntries(talkResponse.headers.entries()),
        data: responseData
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error
    });
  }
} 