import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, tool } = await req.json();
    
    if (!name || !email || !tool) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sql = neon(process.env.DATABASE_URL!);
    
    await sql`
      CREATE TABLE IF NOT EXISTS tool_suggestions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        tool TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      INSERT INTO tool_suggestions (name, email, tool)
      VALUES (${name}, ${email}, ${tool})
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving suggestion:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
