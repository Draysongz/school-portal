import { GroqProvider } from './groq-provider';
import prisma from '@/lib/prisma';

export class QuizGenerationService {
  static async generateQuiz(subjectId: string, topic: string, difficulty: string, count: number) {
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });

    const prompt = `Generate a quiz with ${count} multiple choice questions for ${subject?.name}.
    Topic: ${topic}.
    Difficulty: ${difficulty}.
    Return as a JSON array of objects with fields: content, options (object with A, B, C, D), correctAnswer (A/B/C/D), marks.`;

    const systemPrompt = "You are a teacher specializing in creating balanced academic quizzes. Output JSON only.";

    const response = await GroqProvider.generate(prompt, systemPrompt);

    try {
      return JSON.parse(response);
    } catch (e) {
      console.error("Failed to parse AI quiz response:", response);
      throw new Error("AI failed to generate valid quiz format.");
    }
  }
}
