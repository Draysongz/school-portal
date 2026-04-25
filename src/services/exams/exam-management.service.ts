import prisma from '@/lib/prisma';

export class ExamManagementService {
  static async createExam(data: {
    schoolId: string;
    subjectId: string;
    title: string;
    description?: string;
    duration: number;
    startTime: Date;
    endTime: Date;
    config?: any;
  }) {
    return await prisma.exam.create({
      data,
    });
  }

  static async addQuestionsToExam(examId: string, questionIds: string[]) {
    return await prisma.exam.update({
      where: { id: examId },
      data: {
        questions: {
          connect: questionIds.map(id => ({ id })),
        },
      },
    });
  }

  static async publishExam(examId: string) {
    return await prisma.exam.update({
      where: { id: examId },
      data: { status: 'PUBLISHED' },
    });
  }
}
