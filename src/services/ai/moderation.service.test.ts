import { describe, it, expect } from 'vitest';
import { ModerationService } from '@/services/ai/moderation.service';

describe('ModerationService', () => {
  it('should flag blacklisted words', async () => {
    const res = await ModerationService.moderateInput('How can I hack the school system?');
    expect(res.safe).toBe(false);
    expect(res.reason).toContain('hack');
  });

  it('should allow safe academic questions', async () => {
    const res = await ModerationService.moderateInput('Explain the Pythagorean theorem.');
    expect(res.safe).toBe(true);
  });
});
