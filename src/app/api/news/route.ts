import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataStore';

export async function GET() {
  const news = readData('news.json');
  return NextResponse.json(news);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const news = readData('news.json');
    
    const newArticle = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      published: true, // admin posts are published instantly
      ...body
    };

    news.push(newArticle);
    writeData('news.json', news);

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create news article' }, { status: 500 });
  }
}
