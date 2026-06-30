import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const businesses = readData('businesses.json');
    const index = businesses.findIndex((b: any) => b.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    businesses[index] = { ...businesses[index], ...body };
    writeData('businesses.json', businesses);

    return NextResponse.json(businesses[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update business' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const businesses = readData('businesses.json');
    const filtered = businesses.filter((b: any) => b.id !== id);

    if (businesses.length === filtered.length) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    writeData('businesses.json', filtered);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete business' }, { status: 500 });
  }
}
