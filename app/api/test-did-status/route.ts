import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Starting D-ID API status check...');
    
    // تنظیم API Key به فرمت صحیح
    const apiKey = process.env.DID_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ 
        status: 'error',
        message: 'API key is not configured',
      }, { status: 500 });
    }

    // 1. تست اتصال اولیه
    const testResponse = await fetch('https://api.d-id.com/talks', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const responseData = await testResponse.json();
    console.log('API Response:', responseData);

    if (!testResponse.ok) {
      return NextResponse.json({ 
        status: 'error',
        message: 'D-ID API authentication failed',
        details: responseData,
        statusCode: testResponse.status
      }, { status: testResponse.status });
    }

    return NextResponse.json({
      status: 'operational',
      message: 'D-ID API is working correctly',
      apiVersion: testResponse.headers.get('x-api-version'),
      authStatus: 'valid',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API status check error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to check API status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 