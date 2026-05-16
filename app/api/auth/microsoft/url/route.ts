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

  const redirectUri = `${origin}/api/auth/microsoft/callback`;

  const state = crypto.randomBytes(16).toString('hex');
  
  const cookieStore = await cookies();
  cookieStore.set('microsoft_redirect_uri', redirectUri, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 600 });
  cookieStore.set('microsoft_state', state, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 600 });

  const clientId = process.env.MICROSOFT_CLIENT_ID || '';

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    response_mode: 'query',
    scope: 'openid profile email offline_access Files.ReadWrite Files.ReadWrite.All',
    state: state,
  });

  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;

  return NextResponse.json({ url: authUrl });
}
