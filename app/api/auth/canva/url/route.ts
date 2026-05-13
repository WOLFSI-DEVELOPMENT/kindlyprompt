import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  let origin = new URL(req.url).origin;
  if (forwardedHost) {
    origin = `${forwardedProto}://${forwardedHost}`;
  }

  const redirectUri = `${origin}/api/auth/canva/callback`;
  
  const clientId = process.env.CANVA_CLIENT_ID || 'OC-AZ4jP-qenVi9';

  // For PKCE, you would normally generate this securely and store the verifier in a cookie.
  // Here we use a static placeholder to allow the flow to proceed for demonstration.
  const codeChallenge = 'dummy_challenge_placeholder_value_must_be_43_chars_long';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'profile:read',
    code_challenge_method: 's256',
    code_challenge: codeChallenge,
  });

  const authUrl = `https://www.canva.com/api/oauth/authorize?${params.toString()}`;

  return NextResponse.json({ url: authUrl });
}
