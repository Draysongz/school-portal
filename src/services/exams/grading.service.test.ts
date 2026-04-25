import { describe, it, expect, vi } from 'vitest';
import { GradingService } from '@/services/exams/grading.service';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    studentExamAttempt: {
      findUnique: vi.fn(),
      update: vi.fn(),
    }
  }
}));

vi.mock('@/services/inngest', () => ({
  inngest: {
    send: vi.fn(),
  }
}));

describe('GradingService', () => {
  it('should auto-grade MCQ questions correctly', async () => {
    const mockAttempt = {
      id: 'attempt-1',
      answers: [{ questionId: 'q-1', answer: 'A' }],
      exam: {
        questions: [{ id: 'q-1', type: 'MCQ', correctAnswer: 'A', marks: 5 }]
      }
    };

    (prisma.studentExamAttempt.findUnique as any).mockResolvedValue(mockAttempt);

    await GradingService.gradeAttempt('attempt-1');

    expect(prisma.studentExamAttempt.update).toHaveBeenCalledWith({
      where: { id: 'attempt-1' },
      data: expect.objectContaining({ score: 5, status: 'GRADED' })
    });
  });

  it('should trigger AI grading if essay is present', async () => {
    const mockAttempt = {
      id: 'attempt-2',
      answers: [],
      exam: {
        questions: [{ id: 'q-2', type: 'ESSAY', marks: 10 }]
      }
    };

    (prisma.studentExamAttempt.findUnique as any).mockResolvedValue(mockAttempt);

    await GradingService.gradeAttempt('attempt-2');

    expect(prisma.studentExamAttempt.update).toHaveBeenCalledWith({
      where: { id: 'attempt-2' },
      data: expect.objectContaining({ status: 'SUBMITTED' })
    });
  });
});
