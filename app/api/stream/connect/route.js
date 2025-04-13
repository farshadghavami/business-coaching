import { NextResponse } from 'next/server';
import { didApi } from '@/lib/didConfig';

export async function POST(request) {
  try {
    // 1. ایجاد یک talk جدید
    const talkResponse = await didApi.post('/talks', {
      source_url: "https://create-images-results.d-id.com/DefaultPresenters/Gina_f/image.jpeg",
      script: {
        type: "text",
        input: "سلام! من مربی کسب و کار شما هستم.",
        provider: {
          type: "
  }
} 