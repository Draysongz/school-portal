import { groq } from '@ai-sdk/groq';
import { streamText, generateText } from 'ai';

export class GroqProvider {
  static async stream(prompt: string, systemPrompt: string, history: any[]) {
    return streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: [...history, { role: 'user', content: prompt }],
    });
  }

  static async generate(prompt: string, systemPrompt: string) {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt,
    });
    return text;
  }
}
