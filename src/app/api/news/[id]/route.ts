import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const news = readData('news.json');
    const index = news.findIndex((n: any) => n.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    news[index] = { ...news[index], ...body };
    writeData('news.json', news);

    return NextResponse.json(news[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const news = readData('news.json');
    const filtered = news.filter((n: any) => n.id !== id);

    if (news.length === filtered.length) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    writeData('news.json', filtered);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
