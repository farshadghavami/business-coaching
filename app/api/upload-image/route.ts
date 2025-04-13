import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Starting image upload process...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    
    // دانلود تصویر از یک URL عمومی
    const sampleImageUrl = "https://avatars.githubusercontent.com/u/1?v=4";
    console.log('Downloading image from:', sampleImageUrl);

    const imageResponse = await fetch(sampleImageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to download image',
        details: {
          status: imageResponse.status,
          statusText: imageResponse.statusText
        }
      });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    console.log('Image downloaded:', {
      size: imageBuffer.byteLength,
      type: imageResponse.headers.get('content-type')
    });

    // آپلود به D-ID
    const formData = new FormData();
    formData.append('image', new Blob([imageBuffer], { 
      type: imageResponse.headers.get('content-type') || 'image/jpeg'
    }), 'sample-face.jpg');

    console.log('Uploading to D-ID...');
    const uploadResponse = await fetch('https://api.d-id.com/images', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`
      },
      body: formData
    });

    const uploadResponseText = await uploadResponse.text();
    console.log('D-ID Response:', {
      status: uploadResponse.status,
      body: uploadResponseText
    });

    if (!uploadResponse.ok) {
      return NextResponse.json({
        status: 'error',
        message: 'D-ID upload failed',
        details: uploadResponseText,
        imageInfo: {
          sourceUrl: sampleImageUrl,
          size: imageBuffer.byteLength
        }
      }, { status: uploadResponse.status });
    }

    const uploadData = JSON.parse(uploadResponseText);
    return NextResponse.json({
      status: 'success',
      upload: uploadData,
      imageInfo: {
        sourceUrl: sampleImageUrl,
        size: imageBuffer.byteLength
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 