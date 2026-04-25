import prisma from '@/lib/prisma';

export class QuestionBankService {
  static async createQuestion(data: {
    schoolId: string;
    subjectId: string;
    content: string;
    type: string;
    options?: any;
    correctAnswer?: string;
    marks: number;
    difficulty?: string;
    tags?: string;
  }) {
    return await prisma.question.create({
      data,
    });
  }

  static async getQuestionsBySubject(schoolId: string, subjectId: string) {
    return await prisma.question.findMany({
      where: { schoolId, subjectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getRandomQuestions(schoolId: string, subjectId: string, count: number) {
    const questions = await this.getQuestionsBySubject(schoolId, subjectId);
    return questions.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}
