import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // ایجاد یک talk جدید با استفاده از API مستقیم D-ID
    const talkResponse = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.DID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: "https://create-images-results.d-id.com/DefaultPresenters/ 