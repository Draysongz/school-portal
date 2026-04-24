import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '@/services/users/user.service';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    $transaction: vi.fn((callback) => callback({
      user: {
        upsert: vi.fn().mockResolvedValue({ id: 'user-1', email: 'test@test.com', role: 'STUDENT' }),
      },
      profile: {
        create: vi.fn().mockResolvedValue({ id: 'profile-1', firstName: 'John', lastName: 'Doe' }),
      },
    })),
  },
}));

describe('UserService', () => {
  it('should create a user and profile in a transaction', async () => {
    const result = await UserService.createUserInSchool({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'STUDENT',
      schoolId: 'school-1',
    });

    expect(result.user.email).toBe('test@test.com');
    expect(result.profile.firstName).toBe('John');
  });
});
