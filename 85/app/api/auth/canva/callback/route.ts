import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { saveAuthUser } from '@/lib/auth-users';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  if (error) {
    return new NextResponse(`Error: ${error} - ${errorDescription}`, { status: 400 });
  }

  if (!code) {
    return new NextResponse('Error: No code provided', { status: 400 });
  }
  
  const cookieStore = await cookies();
  const verifier = cookieStore.get('canva_code_verifier')?.value;
  const redirectUri = cookieStore.get('canva_redirect_uri')?.value;

  if (!verifier || !redirectUri) {
    return new NextResponse('Error: Missing session parameters', { status: 400 });
  }

  const clientId = process.env.CANVA_CLIENT_ID || 'OC-AZ4jP-qenVi9';
  const clientSecret = process.env.CANVA_CLIENT_SECRET || 'cnvcaxexJOzmQpijz-75hup2DxzXE-l7IcKkan2mKBHUPSpE3b75b9c0';

  const authHeader = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://api.canva.com/rest/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code_verifier: verifier,
        code: code,
        redirect_uri: redirectUri,
      }).toString()
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      return new NextResponse(`Token exchange failed: ${tokenRes.status} ${errBody}`, { status: tokenRes.status });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile
    const profileRes = await fetch('https://api.canva.com/rest/v1/users/me/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!profileRes.ok) {
        const profileErrBody = await profileRes.text();
        return new NextResponse(`Profile fetch failed: ${profileRes.status} ${profileErrBody}`, { status: profileRes.status });
    }

    const profileData = await profileRes.json();
    const user = {
        email: profileData.profile?.email || 'canva.user@noemail.com',
        name: profileData.profile?.display_name || 'Canva User',
    };

    await saveAuthUser('canva', user);

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
