import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { saveAuthUser } from '@/lib/auth-users';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return new NextResponse(`Error: ${error}`, { status: 400 });
  }

  if (!code) {
    return new NextResponse('Error: No code provided', { status: 400 });
  }

  const cookieStore = await cookies();
  const redirectUri = cookieStore.get('google_redirect_uri')?.value;
  const savedState = cookieStore.get('google_state')?.value;

  if (state !== savedState) {
    return new NextResponse('Error: State mismatch', { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri!
      }).toString()
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      return new NextResponse(`Token exchange failed: ${tokenRes.status} ${errBody}`, { status: tokenRes.status });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    let user: any = { email: 'user@google.com', name: 'Google User' };

    if (profileRes.ok) {
        const profileData = await profileRes.json();
        user = {
            email: profileData.email,
            name: profileData.name || 'Google User',
            image: profileData.picture,
        };
    }

    await saveAuthUser('google', user);

    const html = `
      <html>
        <head>
          <title>Authenticating...</title>
        </head>
        <body style="background: #000; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh;">
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: ${JSON.stringify(user)} }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (err: any) {
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}
