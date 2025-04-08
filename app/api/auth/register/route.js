import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // In a real application, you would validate and store user data in a database
    // For now, we'll just check if required fields are provided
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Mock successful registration
    // In a real application, you would generate a JWT token here
    const token = 'mock-jwt-token-' + Date.now();

    return NextResponse.json({
      token,
      user: {
        id: '1',
        email,
        name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
} 