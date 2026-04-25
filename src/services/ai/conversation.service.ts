import prisma from '@/lib/prisma';
import { GroqProvider } from './groq-provider';
import { ModerationService } from './moderation.service';

export class AIConversationService {
  static async getContextualPrompt(studentId: string) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        profile: true,
        class: true,
      }
    });

    return `You are a helpful AI tutor for a student in ${student?.class?.name || 'school'}.
    The student's name is ${student?.profile.firstName}.
    Your goal is to explain concepts clearly, encourage critical thinking, and be encouraging.
    Keep responses student-safe and age-appropriate for grade level ${student?.class?.gradeLevel || 'unknown'}.`;
  }

  static async handleChat(data: {
    studentId: string,
    schoolId: string,
    conversationId?: string,
    prompt: string,
  }) {
    // 1. Moderate Input
    const moderation = await ModerationService.moderateInput(data.prompt);
    if (!moderation.safe) {
      throw new Error(moderation.reason);
    }

    // 2. Get/Create Conversation
    const conversation = data.conversationId
      ? await prisma.aiConversation.findUnique({ where: { id: data.conversationId }, include: { messages: true } })
      : await prisma.aiConversation.create({
          data: {
            studentId: data.studentId,
            schoolId: data.schoolId,
            title: data.prompt.slice(0, 50),
          },
          include: { messages: true }
        });

    if (!conversation) throw new Error("Conversation not found.");

    // 3. Prepare Prompt & Stream
    const systemPrompt = await this.getContextualPrompt(data.studentId);
    const history = conversation.messages.map(m => ({ role: m.role, content: m.content }));

    const stream = await GroqProvider.stream(data.prompt, systemPrompt, history);

    // 4. Update Logs & Messages (This would usually be handled by onFinish in streamText)
    // For now we return the stream. Persistence of the final response is handled in the API route.

    return { stream, conversationId: conversation.id };
  }
}
