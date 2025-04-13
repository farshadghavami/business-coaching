import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing D-ID API with new key...');
    
    // API key جدید
    const apiKey = process.env.DID_API_KEY || "aWJjc2FsZXNhaUBnbWFpbC5jb20:1PG3Ib8MjjXHZJAwdgxcJ";
    
    // تست با فرمت استاندارد
    const response = await fetch('https://api.d-id.com/talks', {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json'
      }
    });

    const result = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    };

    try {
      const body = await response.text();
      result.body = body.length < 1000 ? body : body.substring(0, 1000) + '...';
    } catch (e) {
      result.body = 'Failed to read body';
    }

    // اضافه کردن اطلاعات API key برای دیباگ
    const keyInfo = {
      length: apiKey.length,
      format: apiKey.includes(':') ? 'username:key' : 'unknown',
      source: process.env.DID_API_KEY ? 'environment' : 'hardcoded'
    };

    return NextResponse.json({
      status: response.ok ? 'success' : 'error',
      message: response.ok ? 'API key is valid' : 'API key validation failed',
      result,
      keyInfo
    });

  } catch (error) {
    console.error('API key test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'API key test failed',
      error: error instanceof Error ? {
        name: error.name,
        message: error.message
      } : 'Unknown error',
    }, { status: 500 });
  }
} 