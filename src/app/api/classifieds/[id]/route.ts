import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const classifieds = readData('classifieds.json');
    const index = classifieds.findIndex((c: any) => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Classified not found' }, { status: 404 });
    }

    classifieds[index] = { ...classifieds[index], ...body };
    writeData('classifieds.json', classifieds);

    return NextResponse.json(classifieds[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update classified' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const classifieds = readData('classifieds.json');
    const filtered = classifieds.filter((c: any) => c.id !== id);

    if (classifieds.length === filtered.length) {
      return NextResponse.json({ error: 'Classified not found' }, { status: 404 });
    }

    writeData('classifieds.json', filtered);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete classified' }, { status: 500 });
  }
}
