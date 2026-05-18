import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

type DiscoverToolPayload = {
  name?: string;
  description?: string;
  appLink?: string;
  proofLink?: string;
  image?: string;
};

async function ensureDiscoverToolsTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS discover_tools (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      app_link TEXT,
      proof_link TEXT,
      image TEXT,
      upvotes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ tools: [] });
  }

  const sql = neon(process.env.DATABASE_URL);
  await ensureDiscoverToolsTable(sql);

  const tools = await sql`
    SELECT id, name, description, app_link, proof_link, image, upvotes, created_at
    FROM discover_tools
    ORDER BY created_at DESC
    LIMIT 50
  `;

  return NextResponse.json({
    tools: tools.map((tool) => ({
      id: String(tool.id),
      name: tool.name,
      description: tool.description || '',
      appLink: tool.app_link || '',
      proofLink: tool.proof_link || '',
      image: tool.image || '',
      upvotes: tool.upvotes || 0,
    })),
  });
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 });
  }

  const payload = (await request.json()) as DiscoverToolPayload;
  const name = payload.name?.trim();
  if (!name) {
    return NextResponse.json({ error: 'Tool name is required.' }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL);
  await ensureDiscoverToolsTable(sql);

  const [tool] = await sql`
    INSERT INTO discover_tools (name, description, app_link, proof_link, image)
    VALUES (
      ${name},
      ${payload.description?.trim() || null},
      ${payload.appLink?.trim() || null},
      ${payload.proofLink?.trim() || null},
      ${payload.image || null}
    )
    RETURNING id, name, description, app_link, proof_link, image, upvotes
  `;

  return NextResponse.json({
    tool: {
      id: String(tool.id),
      name: tool.name,
      description: tool.description || '',
      appLink: tool.app_link || '',
      proofLink: tool.proof_link || '',
      image: tool.image || '',
      upvotes: tool.upvotes || 0,
    },
  });
}
