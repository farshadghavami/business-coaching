import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing D-ID API connection...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    const encodedAuth = Buffer.from(apiKey).toString('base64');
    
    // 1. تست اتصال ساده
    const testResponse = await fetch('https://api.d-id.com/talks', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
      }
    });

    const testResult = {
      status: testResponse.status,
      statusText: testResponse.statusText,
      headers: Object.fromEntries(testResponse.headers.entries())
    };

    console.log('Connection test result:', testResult);

    let responseBody;
    try {
      const text = await testResponse.text();
      responseBody = JSON.parse(text);
      console.log('Response body:', responseBody);
    } catch (e) {
      console.error('Failed to parse response:', e);
      responseBody = null;
    }

    return NextResponse.json({
      status: testResponse.ok ? 'success' : 'error',
      message: testResponse.ok ? 'API connection successful' : 'API connection failed',
      details: {
        ...testResult,
        body: responseBody
      },
      auth: {
        method: 'Basic',
        keyLength: apiKey.length,
        encodedLength: encodedAuth.length
      }
    });

  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'API test failed',
      error: error instanceof Error ? {
        name: error.name,
        message: error.message
      } : 'Unknown error'
    }, { status: 500 });
  }
} 