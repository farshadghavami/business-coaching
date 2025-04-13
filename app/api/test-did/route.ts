import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    console.log('Testing D-ID API connection...');
    
    // 1. تست اتصال اولیه
    const testResponse = await fetch('https://api.d-id.com/talks', {
      method: 'GET',
      headers: {
        'Authorization': `Basic aWJjc2FsZXNhaUBnbWFpbC5jb20:1PG3Ib8MjjXHZJAwdgxcJ`,
      }
    });

    const testResult = await testResponse.json();
    console.log('Initial API test result:', testResult);

    if (!testResponse.ok) {
      return NextResponse.json({ 
        error: 'API Key validation failed',
        status: testResponse.status,
        details: testResult
      }, { status: testResponse.status });
    }

    // 2. آپلود تصویر به D-ID
    const imagePath = path.join(process.cwd(), 'public', 'avatars', 'custom', 'lenny.png');
    const imageFile = fs.readFileSync(imagePath);

    // ایجاد FormData با استفاده از Blob
    const formData = new FormData();
    const blob = new Blob([imageFile], { type: 'image/png' });
    formData.append('image', blob, 'lenny.png');

    const uploadResponse = await fetch('https://api.d-id.com/images', {
      method: 'POST',
      headers: {
        'Authorization': `Basic aWJjc2FsZXNhaUBnbWFpbC5jb20:1PG3Ib8MjjXHZJAwdgxcJ`,
      },
      body: formData
    });

    const uploadResult = await uploadResponse.json();
    console.log('Image upload result:', uploadResult);

    if (!uploadResponse.ok) {
      return NextResponse.json({ 
        error: 'Image upload failed',
        status: uploadResponse.status,
        details: uploadResult
      }, { status: uploadResponse.status });
    }

    // 3. ایجاد استریم با تصویر آپلود شده
    const streamResponse = await fetch('https://api.d-id.com/talks/streams', {
      method: 'POST',
      headers: {
        'Authorization': `Basic aWJjc2FsZXNhaUBnbWFpbC5jb20:1PG3Ib8MjjXHZJAwdgxcJ`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: uploadResult.url,
        driver_url: "bank://classics/driver-01",
        config: {
          stitch: true,
          streaming_mode: "websocket",
          result_format: "mp4"
        }
      })
    });

    const streamResult = await streamResponse.json();
    console.log('Stream creation test result:', streamResult);
    
    if (!streamResponse.ok) {
      return NextResponse.json({ 
        error: 'Stream creation failed',
        status: streamResponse.status,
        details: streamResult
      }, { status: streamResponse.status });
    }

    return NextResponse.json({
      success: true,
      message: 'D-ID API is working correctly',
      apiStatus: 'valid',
      imageUpload: uploadResult,
      streamTest: streamResult
    });

  } catch (error) {
    console.error('❌ Test error:', error);
    return NextResponse.json(
      { 
        error: 'API test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 