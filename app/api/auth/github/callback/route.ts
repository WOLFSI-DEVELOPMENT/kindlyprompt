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
  const redirectUri = cookieStore.get('github_redirect_uri')?.value;
  const savedState = cookieStore.get('github_state')?.value;

  if (state !== savedState) {
    return new NextResponse('Error: State mismatch', { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID || '';
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || '';

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      })
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
    const profileRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let user: any = { email: 'user@github.com', name: 'GitHub User' };

    if (profileRes.ok) {
        const profileData = await profileRes.json();
        user = {
            email: profileData.email,
            name: profileData.name || profileData.login,
            image: profileData.avatar_url,
        };

        // If email is null, fetch from /user/emails
        if (!user.email) {
            const emailRes = await fetch('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (emailRes.ok) {
                const emails = await emailRes.json();
                const primaryEmail = emails.find((e: any) => e.primary) || emails[0];
                if (primaryEmail) {
                    user.email = primaryEmail.email;
                }
            }
        }
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
