import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { q } = body;

    // For simplicity, return 'auto' to let MyMemory handle language detection
    // MyMemory can detect language when source is set to 'auto'
    return NextResponse.json([{ language: 'auto' }]);
  } catch (error) {
    console.error('Detection API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
