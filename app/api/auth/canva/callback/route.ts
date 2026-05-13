import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  
  // Here you would normally exchange the code for an access token using your CANVA_CLIENT_SECRET
  // and the PKCE code_verifier.

  const html = `
    <html>
      <head>
        <title>Authenticating...</title>
      </head>
      <body style="background: #000; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-center: center; height: 100vh;">
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
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
}
