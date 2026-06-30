import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // Default password for admin panel: admin123
    if (password === 'admin123') {
      const response = NextResponse.json({ success: true, token: 'admin-secret-token' });
      
      // Set simple cookie
      response.cookies.set('admin_session', 'admin-secret-token', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
