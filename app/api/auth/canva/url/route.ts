import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientOrigin = url.searchParams.get('origin');
  
  let origin = clientOrigin || url.origin;
  
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  if (!clientOrigin && forwardedHost) {
    origin = `${forwardedProto}://${forwardedHost}`;
  }

  const redirectUri = `${origin}/api/auth/canva/callback`;
  
  const clientId = process.env.CANVA_CLIENT_ID || 'OC-AZ4jP-qenVi9';

  // Generate PKCE
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');

  // Store verifier and redirectUri in cookies for the callback
  const cookieStore = await cookies();
  cookieStore.set('canva_code_verifier', verifier, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 600 });
  cookieStore.set('canva_redirect_uri', redirectUri, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 600 });

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'profile:read',
    code_challenge_method: 's256',
    code_challenge: challenge,
  });

  const authUrl = `https://www.canva.com/api/oauth/authorize?${params.toString()}`;

  return NextResponse.json({ url: authUrl });
}
