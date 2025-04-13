import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('Testing D-ID API authentication methods...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    
    // تست‌های مختلف authentication
    const authTests = [
      {
        name: 'Basic (Raw)',
        headers: {
          'Authorization': `Basic ${apiKey}`
        }
      },
      {
        name: 'Basic (Base64)',
        headers: {
          'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`
        }
      },
      {
        name: 'Basic (Username:Password)',
        headers: {
          'Authorization': `Basic ${Buffer.from(`ibcsalesai@gmail.com:N1a5ITBHb-M1u33MNrPud`).toString('base64')}`
        }
      },
      {
        name: 'Bearer',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    ];

    const results = [];

    // تست هر روش
    for (const test of authTests) {
      console.log(`Testing ${test.name}...`);
      
      try {
        const response = await fetch('https://api.d-id.com/talks', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            ...test.headers
          }
        });

        const responseText = await response.text();
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          responseData = responseText;
        }

        console.log(`${test.name} result:`, {
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          data: responseData
        });

        results.push({
          method: test.name,
          status: response.status,
          headers: test.headers,
          response: responseData
        });

      } catch (error) {
        console.error(`Error in ${test.name}:`, error);
        results.push({
          method: test.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // اگر یکی از تست‌ها موفق بود، با همون روش یک talk ایجاد می‌کنیم
    const successfulTest = results.find(r => r.status === 200);
    if (successfulTest) {
      console.log(`Creating talk with successful auth method: ${successfulTest.method}`);
      
      const talkResponse = await fetch('https://api.d-id.com/talks', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          ...successfulTest.headers
        },
        body: JSON.stringify({
          script: {
            type: "text",
            input: "Hello",
            provider: {
              type: "microsoft",
              voice_id: "en-US-JennyNeural"
            }
          },
          source_url: "https://raw.githubusercontent.com/did-developer-community/image-samples/main/speaking-man.jpeg"
        })
      });

      const talkData = await talkResponse.json();
      results.push({
        method: 'Create Talk',
        status: talkResponse.status,
        response: talkData
      });
    }

    return NextResponse.json({
      status: 'completed',
      results: results
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 