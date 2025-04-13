import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing D-ID API authentication...');
    
    // API key اصلی که قبلاً کار می‌کرد
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:1PG3Ib8MjjXHZJAwdgxcJ";
    
    // تست با فرمت‌های مختلف Authorization
    const authFormats = [
      `Basic ${apiKey}`,
      `Basic ${Buffer.from(apiKey).toString('base64')}`,
      apiKey
    ];

    const results = [];

    for (const auth of authFormats) {
      console.log(`Testing with Authorization: ${auth.substring(0, 20)}...`);
      
      const response = await fetch('https://api.d-id.com/talks', {
        method: 'GET',
        headers: {
          'Authorization': auth,
          'Accept': 'application/json'
        }
      });

      const result = {
        authFormat: auth === apiKey ? 'Raw Key' : 
                   auth.startsWith('Basic') ? (auth.includes('Basic ' + apiKey) ? 'Basic Raw' : 'Basic Base64') : 
                   'Unknown',
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

      results.push(result);
    }

    // اضافه کردن اطلاعات محیط برای دیباگ
    const environmentInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      apiKey: {
        length: apiKey.length,
        containsColon: apiKey.includes(':'),
        format: apiKey.split(':').length === 2 ? 'username:password' : 'unknown'
      }
    };

    return NextResponse.json({
      status: 'completed',
      message: 'Authentication test completed',
      results,
      environment: environmentInfo
    });

  } catch (error) {
    console.error('Authentication test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Authentication test failed',
      error: error instanceof Error ? {
        name: error.name,
        message: error.message
      } : 'Unknown error',
    }, { status: 500 });
  }
} 