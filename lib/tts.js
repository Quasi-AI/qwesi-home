'use server';

import googleTTS from 'google-tts-api';

export async function generateSpeech(text) {
  try {
    // Use Google TTS to generate speech URL
    const url = googleTTS.getAudioUrl(text, {
      lang: 'en-US',
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
    });

    // Fetch the audio data from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch audio from Google TTS');
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('Error generating speech:', error);
    throw new Error('Failed to generate speech');
  }
}
