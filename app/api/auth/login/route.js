import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // In a real application, you would validate credentials against a database
    // For now, we'll just check if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock successful login
    // In a real application, you would generate a JWT token here
    const token = 'mock-jwt-token-' + Date.now();

    return NextResponse.json({
      token,
      user: {
        id: '1',
        email,
        name: 'Test User',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 