import prisma from '@/lib/prisma';
import { inngest } from '@/services/inngest';

export class GradingService {
  static async gradeAttempt(attemptId: string) {
    const attempt = await prisma.studentExamAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: {
          include: {
            // Need to link question for correct answer
          }
        },
        exam: {
          include: { questions: true }
        }
      }
    });

    if (!attempt) return;

    let totalScore = 0;
    const pendingQuestions = [];

    for (const question of attempt.exam.questions) {
      const studentAnswer = attempt.answers.find(a => a.questionId === question.id);

      if (['MCQ', 'TRUE_FALSE', 'SINGLE_CHOICE'].includes(question.type)) {
        if (studentAnswer?.answer === question.correctAnswer) {
          totalScore += question.marks;
        }
      } else if (question.type === 'ESSAY') {
        pendingQuestions.push(question.id);
      }
    }

    await prisma.studentExamAttempt.update({
      where: { id: attemptId },
      data: {
        score: totalScore,
        status: pendingQuestions.length > 0 ? 'SUBMITTED' : 'GRADED',
      }
    });

    if (pendingQuestions.length > 0) {
      // Trigger AI grading for essays
      await inngest.send({
        name: 'app/exam.grade-ai',
        data: { attemptId }
      });
    }
  }
}
