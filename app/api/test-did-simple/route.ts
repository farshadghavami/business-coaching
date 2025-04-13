import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Testing D-ID API connection...');
    
    // API key جدید
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";

    // تست با فرمت‌های مختلف
    const authMethods = [
      {
        name: 'Basic Raw',
        headers: {
          'Authorization': `Basic ${apiKey}`
        }
      },
      {
        name: 'Basic Encoded',
        headers: {
          'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`
        }
      },
      {
        name: 'Bearer',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      },
      {
        name: 'Direct',
        headers: {
          'Authorization': apiKey
        }
      }
    ];

    const results = [];

    // تست هر روش
    for (const method of authMethods) {
      console.log(`Testing ${method.name}...`);
      
      const response = await fetch('https://api.d-id.com/talks', {
        method: 'GET',
        headers: {
          ...method.headers,
          'Content-Type': 'application/json'
        }
      });

      const result = {
        method: method.name,
        status: response.status,
        statusText: response.statusText
      };

      try {
        const text = await response.text();
        result.response = JSON.parse(text);
      } catch (e) {
        result.error = e instanceof Error ? e.message : 'Failed to parse response';
      }

      results.push(result);
      console.log(`${method.name} result:`, result);
    }

    // یافتن روش موفق
    const successfulMethod = results.find(r => r.status === 200);

    return NextResponse.json({
      status: successfulMethod ? 'success' : 'error',
      message: successfulMethod 
        ? `API connection successful using ${successfulMethod.method}`
        : 'Failed to connect with any authentication method',
      results: results.map(r => ({
        ...r,
        headers: r.headers ? Object.fromEntries(
          Object.entries(r.headers).filter(([key]) => !key.toLowerCase().includes('authorization'))
        ) : undefined
      }))
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