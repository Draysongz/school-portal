import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/users/user.service';
import { getSession } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const schoolId = session.schoolId;
  if (!schoolId) return NextResponse.json({ error: 'No school context' }, { status: 400 });

  const role = request.nextUrl.searchParams.get('role') as Role | undefined;
  const users = await UserService.getUsersInSchool(schoolId, role);

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const schoolId = session.schoolId;
  if (!schoolId) return NextResponse.json({ error: 'No school context' }, { status: 400 });

  try {
    const body = await request.json();
    const result = await UserService.createUserInSchool({
      ...body,
      schoolId,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
