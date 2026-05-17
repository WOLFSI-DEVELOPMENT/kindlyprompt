import { neon } from '@neondatabase/serverless';

type AuthUser = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

export async function saveAuthUser(provider: string, user: AuthUser) {
  if (!process.env.DATABASE_URL || !user.email) return;

  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS auth_users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      image TEXT,
      provider TEXT NOT NULL,
      last_login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    INSERT INTO auth_users (email, name, image, provider)
    VALUES (${user.email}, ${user.name || null}, ${user.image || null}, ${provider})
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      image = COALESCE(EXCLUDED.image, auth_users.image),
      provider = EXCLUDED.provider,
      last_login_at = CURRENT_TIMESTAMP
  `;
}
