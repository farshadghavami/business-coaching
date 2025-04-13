import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing D-ID API with Bearer token...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:1PG3Ib8MjjXHZJAwdgxcJ";
    
    // تست با فرمت Bearer
    const response = await fetch('https://api.d-id.com/talks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const result = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    };

    let responseBody;
    try {
      responseBody = await response.text();
      // سعی می‌کنیم به عنوان JSON پارس کنیم
      try {
        result.parsedBody = JSON.parse(responseBody);
      } catch {
        result.rawBody = responseBody;
      }
    } catch (e) {
      result.bodyError = 'Failed to read response body';
    }

    // اطلاعات درخواست برای دیباگ
    const requestInfo = {
      url: 'https://api.d-id.com/talks',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey.substring(0, 10)}...`, // نمایش بخشی از کلید برای امنیت
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    return NextResponse.json({
      status: response.ok ? 'success' : 'error',
      message: response.ok ? 'API connection successful' : 'API connection failed',
      request: requestInfo,
      result
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