import { describe, it, expect, vi } from 'vitest';
import { TimetableService } from '@/services/academic/timetable.service';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    timetable: {
      findFirst: vi.fn(),
      create: vi.fn(),
    }
  }
}));

describe('TimetableService', () => {
  it('should detect conflicts if a class is busy', async () => {
    (prisma.timetable.findFirst as any).mockResolvedValue({ id: 'existing-entry' });

    await expect(TimetableService.addEntry({
      classId: 'class-1',
      subjectId: 'subject-1',
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '09:00',
    })).rejects.toThrow('Timetable conflict detected');
  });

  it('should create entry if no conflict', async () => {
    (prisma.timetable.findFirst as any).mockResolvedValue(null);
    (prisma.timetable.create as any).mockResolvedValue({ id: 'new-entry' });

    const result = await TimetableService.addEntry({
      classId: 'class-1',
      subjectId: 'subject-1',
      dayOfWeek: 2,
      startTime: '10:00',
      endTime: '11:00',
    });

    expect(result.id).toBe('new-entry');
  });
});
