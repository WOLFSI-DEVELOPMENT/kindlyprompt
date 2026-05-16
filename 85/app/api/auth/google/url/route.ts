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

  const redirectUri = `${origin}/api/auth/google/callback`;

  const state = crypto.randomBytes(16).toString('hex');
  
  const cookieStore = await cookies();
  cookieStore.set('google_redirect_uri', redirectUri, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 600 });
  cookieStore.set('google_state', state, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 600 });

  const clientId = process.env.GOOGLE_CLIENT_ID || '';

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    redirect_uri: redirectUri,
    state: state,
    access_type: 'offline',
    prompt: 'consent'
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.json({ url: authUrl });
}
