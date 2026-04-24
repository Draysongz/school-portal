import { NextRequest, NextResponse } from 'next/server';
import { AcademicService } from '@/services/academic/academic.service';
import { getSession } from '@/lib/auth/session';

export async function GET() {
  const session = await getSession();
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const years = await AcademicService.getAcademicYears(session.schoolId as string);
  return NextResponse.json(years);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const year = await AcademicService.createAcademicYear({
      ...body,
      schoolId: session.schoolId as string,
    });
    return NextResponse.json(year);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
