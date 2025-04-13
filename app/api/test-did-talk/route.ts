import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('Testing D-ID talk creation with successful parameters...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    
    // استفاده از پارامترهای موفق از talk های قبلی
    const talkData = {
      script: {
        type: "text",
        input: "Hello",
        provider: {
          type: "microsoft",
          voice_id: "fa-IR-DilaraNeural"
        }
      },
      config: {
        stitch: false,
        align_driver: true,
        sharpen: true,
        normalization_factor: 1,
        result_format: ".mp4",
        fluent: false,
        pad_audio: 0,
        reduce_noise: false,
        auto_match: true,
        show_watermark: false,
        logo: {
          url: "ai",
          position: [0, 0]
        },
        motion_factor: 1,
        optimize_audio: true,
        align_expand_factor: 0.3
      },
      source_url: "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/image.jpeg",
      driver_url: "bank://natural/"
    };

    console.log('Sending request with data:', JSON.stringify(talkData, null, 2));

    const talkResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(talkData)
    });

    console.log('Response status:', talkResponse.status);
    console.log('Response headers:', Object.fromEntries(talkResponse.headers.entries()));
    
    const responseText = await talkResponse.text();
    console.log('Raw response:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', e);
      responseData = responseText;
    }

    // اگر talk با موفقیت ایجاد شد، وضعیت اون رو چک می‌کنیم
    if (talkResponse.ok && responseData.id) {
      console.log('Talk created, checking status...');
      
      const statusResponse = await fetch(`https://api.d-id.com/talks/${responseData.id}`, {
        headers: {
          'Authorization': `Basic ${apiKey}`,
          'accept': 'application/json'
        }
      });

      const statusData = await statusResponse.json();
      console.log('Talk status:', statusData);

      return NextResponse.json({
        status: 'success',
        talkCreation: {
          status: talkResponse.status,
          data: responseData
        },
        talkStatus: {
          status: statusResponse.status,
          data: statusData
        }
      });
    }

    return NextResponse.json({
      status: 'error',
      request: talkData,
      response: {
        status: talkResponse.status,
        headers: Object.fromEntries(talkResponse.headers.entries()),
        data: responseData
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 