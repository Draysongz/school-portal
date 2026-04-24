import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import prisma from '@/lib/prisma';
import { inngest } from '@/services/inngest';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { rows, role, fileName } = await request.json();
    const schoolId = session.schoolId as string;

    // 1. Create Log Entry
    const log = await prisma.cSVUploadLog.create({
      data: {
        schoolId,
        fileName,
        status: 'PENDING',
      }
    });

    // 2. Trigger Background Job
    await inngest.send({
      name: "app/bulk.upload",
      data: {
        rows,
        role,
        schoolId,
        uploadLogId: log.id,
      }
    });

    return NextResponse.json({ success: true, logId: log.id });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
