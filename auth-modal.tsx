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

  const redirectUri = `${origin}/api/auth/discord/callback`;

  const state = crypto.randomBytes(16).toString('hex');
  
  const cookieStore = await cookies();
  cookieStore.set('discord_redirect_uri', redirectUri, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 600 });
  cookieStore.set('discord_state', state, { httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 600 });

  const clientId = process.env.DISCORD_CLIENT_ID || '';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state: state,
    scope: 'identify email'
  });

  const authUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;

  return NextResponse.json({ url: authUrl });
}
