import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const clientOrigin = url.searchParams.get('origin');
  
  let origin = clientOrigin || url.origin;
  
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  if (!clientOrigin && forwardedHost) {
    origin = `${forwardedProto}://${forwardedHost}`;
  }

  const redirectUri = `${origin}/api/auth/tiktok/callback`;

  // Generate verifier and challenge (TikTok uses PKCE)
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  const state = crypto.randomBytes(16).toString('hex');
  
  const cookieStore = await cookies();
  cookieStore.set('tiktok_code_verifier', verifier, { httpOnly: true, secure: true, path: '/', maxAge: 600 });
  cookieStore.set('tiktok_redirect_uri', redirectUri, { httpOnly: true, secure: true, path: '/', maxAge: 600 });
  cookieStore.set('tiktok_state', state, { httpOnly: true, secure: true, path: '/', maxAge: 600 });

  const clientKey = process.env.TIKTOK_CLIENT_KEY || ''; // Ensure this is set securely

  const params = new URLSearchParams({
    client_key: clientKey,
    response_type: 'code',
    scope: 'user.info.basic',
    redirect_uri: redirectUri,
    state: state,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  });

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;

  return NextResponse.json({ url: authUrl });
}
