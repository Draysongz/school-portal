export class ModerationService {
  private static blacklist = ['hack', 'cheat', 'bypass', 'steal', 'violence', 'hate'];

  static async moderateInput(input: string): Promise<{ safe: boolean; reason?: string }> {
    const lowercaseInput = input.toLowerCase();
    for (const word of this.blacklist) {
      if (lowercaseInput.includes(word)) {
        return { safe: false, reason: `Inappropriate content detected: ${word}` };
      }
    }
    return { safe: true };
  }

  static async moderateOutput(output: string): Promise<string> {
    // Basic filter for now, can be extended to use an LLM for moderation
    return output;
  }
}
