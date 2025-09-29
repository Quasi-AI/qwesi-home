import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { q, source, target, format } = body;

    // Use MyMemory Translate API (free, no API key required)
    const langpair = `${source}|${target}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${langpair}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();

    // MyMemory returns data in a different format
    // Transform to match LibreTranslate format
    let translatedText = data.responseData?.translatedText || q;

    // For testing: add language indicator
    if (target === 'fr') {
      translatedText = `${translatedText}`;
    } else if (target === 'es') {
      translatedText = `${translatedText}`;
    } else if (target === 'de') {
      translatedText = `${translatedText}`;
    }

    return NextResponse.json({
      translatedText: translatedText
    });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // For language detection or other GET requests if needed
  return NextResponse.json({ message: 'Use POST for translation' });
}
