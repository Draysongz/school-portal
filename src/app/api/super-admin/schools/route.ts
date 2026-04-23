import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession();
  if (session?.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const schools = await prisma.school.findMany({
    include: {
      _count: {
        select: { profiles: true }
      }
    }
  });

  return NextResponse.json(schools);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (session?.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { name, subdomain, primaryColor, secondaryColor } = await request.json();

    const school = await prisma.school.create({
      data: {
        name,
        subdomain,
        primaryColor,
        secondaryColor,
        settings: {
          create: {}
        }
      }
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error('Failed to create school:', error);
    return NextResponse.json({ error: 'Failed to create school' }, { status: 500 });
  }
}
