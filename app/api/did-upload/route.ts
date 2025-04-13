import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // آپلود به D-ID
    const uploadResponse = await fetch('https://api.d-id.com/images', {
      method: 'POST',
      headers: {
        'Authorization': `Basic aWJjc2FsZXNhaUBnbWFpbC5jb20:1PG3Ib8MjjXHZJAwdgxcJ`,
      },
      body: formData
    });

    const result = await uploadResponse.json();
    console.log('Upload result:', result);

    if (!uploadResponse.ok) {
      return NextResponse.json(
        { error: 'Upload failed', details: result },
        { status: uploadResponse.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    );
  }
} 