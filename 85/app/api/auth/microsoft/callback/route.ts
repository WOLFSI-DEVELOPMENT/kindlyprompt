import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { saveAuthUser } from '@/lib/auth-users';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');

  const cookieStore = await cookies();
  const savedState = cookieStore.get('microsoft_state')?.value;
  const redirectUri = cookieStore.get('microsoft_redirect_uri')?.value;

  if (!code || !returnedState || returnedState !== savedState) {
    return new NextResponse('Invalid state or missing code', { status: 400 });
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID || '';
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET || '';

  try {
    const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri || '',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
        console.error("Token error", tokenData);
        throw new Error(tokenData.error_description || 'Failed to exchange code for token');
    }

    const { access_token } = tokenData;

    const userRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = await userRes.json();

    const name = userData.displayName;
    const email = userData.mail || userData.userPrincipalName;
    const user = { name, email };
    await saveAuthUser('microsoft', user);
    const authSuccessHtml = `
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'OAUTH_AUTH_SUCCESS',
              provider: 'microsoft',
              user: ${JSON.stringify(user)}
            }, '*');
            window.close();
          </script>
        </body>
      </html>
    `;

    return new NextResponse(authSuccessHtml, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Microsoft OAuth error:', error);
    return new NextResponse('OAuth failed', { status: 500 });
  }
}
