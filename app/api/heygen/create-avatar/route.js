import { NextResponse } from 'next/server';
import { heygenApi } from '@/lib/heygenConfig';

export async function POST(request) {
  try {
    // استفاده از avatar ID ثابت برای تست
    const avatarId = '4a8f636d09614e48a860881fa1b448a6';

    const response = await heygenApi.post('/v1/avatars/talking_photo/videos', {
      avatar_id: avatarId,
      input_text: "سلام! این یک تست برای اتصال به HeyGen API است.",
      voice_id: "en-US-Jenny", // یا هر voice ID دیگری که می‌خواهید استفاده کنید
      output_format: "mp4",
      test: true // برای تست اولیه
    });

    return NextResponse.json({
      success: true,
      data: response.data
    });
    
  } catch (error) {
    console.error('HeyGen API error:', error.response?.data || error.message);
    return NextResponse.json(
      { 
        error: error.response?.data?.message || error.message,
        details: error.response?.data
      },
      { status: error.response?.status || 500 }
    );
  }
} 