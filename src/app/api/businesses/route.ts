import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/dataStore';

export async function GET() {
  const businesses = readData('businesses.json');
  return NextResponse.json(businesses);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const businesses = readData('businesses.json');
    
    const newBusiness = {
      id: Date.now().toString(),
      approved: false, // requires admin approval by default
      featured: false,
      ...body
    };

    businesses.push(newBusiness);
    writeData('businesses.json', businesses);

    return NextResponse.json(newBusiness, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create business listing' }, { status: 500 });
  }
}
