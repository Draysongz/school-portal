import { describe, it, expect } from 'vitest';
import { hasPermission } from '@/lib/auth/permissions';

describe('RBAC Permissions', () => {
  it('should allow SUPER_ADMIN to manage all', () => {
    expect(hasPermission('SUPER_ADMIN', 'manage:all')).toBe(true);
    expect(hasPermission('SUPER_ADMIN', 'mark:attendance')).toBe(true);
  });

  it('should allow TEACHER to mark attendance but not manage school', () => {
    expect(hasPermission('TEACHER', 'mark:attendance')).toBe(true);
    expect(hasPermission('TEACHER', 'manage:school')).toBe(false);
  });

  it('should allow STUDENT to take exams', () => {
    expect(hasPermission('STUDENT', 'take:exam')).toBe(true);
    expect(hasPermission('STUDENT', 'manage:users')).toBe(false);
  });
});
