import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing D-ID API connection...');
    console.log('API Key:', process.env.DID_API_KEY); // فقط برای دیباگ

    const response = await fetch('https://api.d-id.com/talks', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${process.env.DID_API_KEY}`,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API test failed:', errorText);
      throw new Error(`API test failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('API test successful:', data);

    return NextResponse.json({
      status: 'connected',
      message: 'Successfully connected to D-ID API'
    });

  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message 
      },
      { status: 500 }
    );
  }
} 