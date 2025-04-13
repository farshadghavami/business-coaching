import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing D-ID API with multiple auth formats...');
    
    // API key های مختلف برای تست
    const keys = {
      env: process.env.DID_API_KEY || '',
      hardcoded: "aWJjc2FsZXNhaUBnbWFpbC5jb20:1PG3Ib8MjjXHZJAwdgxcJ"
    };

    // فرمت‌های مختلف برای تست
    const formats = [
      {
        name: 'Basic Direct',
        headers: { 'Authorization': `Basic ${keys.hardcoded}` }
      },
      {
        name: 'Basic Encoded',
        headers: { 'Authorization': `Basic ${Buffer.from(keys.hardcoded).toString('base64')}` }
      },
      {
        name: 'Bearer Direct',
        headers: { 'Authorization': `Bearer ${keys.hardcoded}` }
      },
      {
        name: 'Direct Key',
        headers: { 'Authorization': keys.hardcoded }
      },
      {
        name: 'Environment Key',
        headers: { 'Authorization': keys.env }
      }
    ];

    const results = [];

    for (const format of formats) {
      console.log(`Testing format: ${format.name}`);
      
      const response = await fetch('https://api.d-id.com/talks', {
        method: 'GET',
        headers: {
          ...format.headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const result = {
        format: format.name,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      };

      try {
        const body = await response.text();
        try {
          result.body = JSON.parse(body);
        } catch {
          result.body = body;
        }
      } catch (e) {
        result.body = 'Failed to read body';
      }

      results.push(result);
    }

    // اطلاعات کلیدها برای دیباگ (بدون نمایش کامل کلیدها)
    const keyInfo = {
      env: {
        exists: !!keys.env,
        length: keys.env.length,
        format: keys.env.includes(':') ? 'username:key' : 'unknown'
      },
      hardcoded: {
        length: keys.hardcoded.length,
        format: keys.hardcoded.includes(':') ? 'username:key' : 'unknown'
      }
    };

    return NextResponse.json({
      status: 'completed',
      message: 'Multi-format test completed',
      keyInfo,
      results
    });

  } catch (error) {
    console.error('Multi-format test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Test failed',
      error: error instanceof Error ? {
        name: error.name,
        message: error.message
      } : 'Unknown error'
    }, { status: 500 });
  }
} 