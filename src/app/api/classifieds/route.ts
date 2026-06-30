import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataStore';

export async function GET() {
  const classifieds = readData('classifieds.json');
  return NextResponse.json(classifieds);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const classifieds = readData('classifieds.json');
    
    const newClassified = {
      id: Date.now().toString(),
      approved: false, // requires admin approval by default
      ...body
    };

    classifieds.push(newClassified);
    writeData('classifieds.json', classifieds);

    return NextResponse.json(newClassified, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create classified listing' }, { status: 500 });
  }
}
