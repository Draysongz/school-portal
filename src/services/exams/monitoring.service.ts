import prisma from '@/lib/prisma';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export class ExamMonitoringService {
  static async logEvent(attemptId: string, type: string, metadata?: any) {
    // 1. Persist to DB
    const log = await prisma.antiCheatLog.create({
      data: {
        attemptId,
        type,
        metadata,
      }
    });

    // 2. Alert teacher in real-time
    const attempt = await prisma.studentExamAttempt.findUnique({
      where: { id: attemptId },
      include: { exam: true, student: { include: { profile: true } } }
    });

    if (attempt) {
      await pusher.trigger(`exam-${attempt.examId}-monitoring`, 'cheat:detected', {
        studentName: `${attempt.student.profile.firstName} ${attempt.student.profile.lastName}`,
        type,
        timestamp: log.timestamp,
      });
    }

    return log;
  }
}
