import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { AIConversationService } from '@/services/ai/conversation.service';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { prompt, conversationId } = await request.json();
    const schoolId = session.schoolId as string;

    // Simple student identification - in a real app, find the Student record linked to this session User
    const student = await prisma.student.findFirst({
      where: { profile: { userId: session.userId as string } }
    });

    if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });

    const { stream, conversationId: cid } = await AIConversationService.handleChat({
      studentId: student.id,
      schoolId,
      conversationId,
      prompt,
    });

    return stream.toDataStreamResponse({
      headers: {
        'x-conversation-id': cid
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
