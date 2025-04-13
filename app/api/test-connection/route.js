import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // تست اتصال به D-ID API
    const response = await fetch('https://api.d-id.com/talks', {
      headers: {
        'Authorization': `Basic ${process.env.DID_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API connection failed: ${response.status}`);
    }

    return NextResponse.json({ status: 'connected' });
  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 