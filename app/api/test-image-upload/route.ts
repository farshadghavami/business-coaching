import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    console.log('Testing image upload to D-ID...');
    
    const apiKey = "aWJjc2FsZXNhaUBnbWFpbC5jb20:N1a5ITBHb-M1u33MNrPud";
    const imagePath = path.join(process.cwd(), 'public', 'sample.jpg');
    
    // چک کردن وجود فایل
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Image file not found',
        checkedPath: imagePath
      }, { status: 404 });
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const stats = fs.statSync(imagePath);

    // ایجاد FormData به صورت دستی
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const formDataHeader = `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="sample.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`;
    const formDataFooter = `\r\n--${boundary}--\r\n`;

    const formDataHeaderBuffer = Buffer.from(formDataHeader);
    const formDataFooterBuffer = Buffer.from(formDataFooter);
    const fullBuffer = Buffer.concat([formDataHeaderBuffer, imageBuffer, formDataFooterBuffer]);

    console.log('File details:', {
      size: stats.size,
      fullSize: fullBuffer.length,
      path: imagePath
    });

    const uploadResponse = await fetch('https://api.d-id.com/images', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBuffer.length.toString()
      },
      body: fullBuffer
    });

    const responseData = await uploadResponse.json();
    console.log('Upload response:', {
      status: uploadResponse.status,
      headers: Object.fromEntries(uploadResponse.headers.entries()),
      data: responseData
    });

    if (!uploadResponse.ok) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Failed to upload image',
        details: responseData,
        statusCode: uploadResponse.status,
        requestDetails: {
          fileSize: stats.size,
          contentLength: fullBuffer.length,
          boundary: boundary
        }
      }, { status: uploadResponse.status });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Image uploaded successfully',
      imageUrl: responseData.url,
      details: responseData
    });

  } catch (error) {
    console.error('Upload test error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to test upload',
      error: error instanceof Error ? error.message : 'Unknown error',
      errorDetails: error
    }, { status: 500 });
  }
} 