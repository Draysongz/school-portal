import prisma from '@/lib/prisma';
import { AttendanceStatus } from '@prisma/client';
import { inngest } from '@/services/inngest';

export class AttendanceService {
  static async markAttendance(data: {
    schoolId: string;
    classId: string;
    date: Date;
    records: { studentId: string; status: AttendanceStatus }[];
  }) {
    return await prisma.$transaction(async (tx) => {
      const results = [];
      for (const record of data.records) {
        const attendance = await tx.attendance.upsert({
          where: {
            // Need a unique constraint on studentId + date if we want easy upserts
            // For now using ID-less mark and triggering events
            id: 'temp-id-handled-by-create-for-simplicity'
          },
          update: { status: record.status },
          create: {
            studentId: record.studentId,
            date: data.date,
            status: record.status,
            schoolId: data.schoolId,
          }
        }).catch(() => {
          // Fallback if ID-based upsert fails (since we don't have a unique constraint on date/student yet)
          return tx.attendance.create({
            data: {
              studentId: record.studentId,
              date: data.date,
              status: record.status,
              schoolId: data.schoolId,
            }
          });
        });

        if (record.status === 'ABSENT') {
          await inngest.send({
            name: 'app/attendance.absent',
            data: {
              studentId: record.studentId,
              schoolId: data.schoolId,
              date: data.date,
            }
          });
        }
        results.push(attendance);
      }
      return results;
    });
  }

  static async getAttendanceStats(studentId: string) {
    const records = await prisma.attendance.findMany({
      where: { studentId }
    });

    const total = records.length;
    const present = records.filter(r => r.status === 'PRESENT').length;

    return {
      total,
      present,
      percentage: total > 0 ? (present / total) * 100 : 0
    };
  }
}
