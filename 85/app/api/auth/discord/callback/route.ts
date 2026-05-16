import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
  const redirectUri = cookieStore.get('discord_redirect_uri')?.value;
  const savedState = cookieStore.get('discord_state')?.value;

  if (state !== savedState) {
    return new NextResponse('Error: State mismatch', { status: 400 });
  }

  const clientId = process.env.DISCORD_CLIENT_ID || '';
  const clientSecret = process.env.DISCORD_CLIENT_SECRET || '';

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri || ''
      }).toString()
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      return new NextResponse(`Token exchange failed: ${tokenRes.status} ${errBody}`, { status: tokenRes.status });
    }

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
       return new NextResponse(`Token exchange failed: ${tokenData.error_description}`, { status: 400 });
    }
    const accessToken = tokenData.access_token;

    // Fetch user profile
    const profileRes = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    let user: any = { email: 'user@discord.com', name: 'Discord User' };

    if (profileRes.ok) {
        const profileData = await profileRes.json();
        user = {
            email: profileData.email,
            name: profileData.username,
            image: profileData.avatar ? `https://cdn.discordapp.com/avatars/${profileData.id}/${profileData.avatar}.png` : undefined,
        };
    }

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
