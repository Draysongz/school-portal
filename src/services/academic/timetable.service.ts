import prisma from '@/lib/prisma';

export class TimetableService {
  static async addEntry(data: {
    classId: string;
    subjectId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }) {
    // 1. Conflict Detection
    const conflicts = await prisma.timetable.findFirst({
      where: {
        OR: [
          {
            classId: data.classId,
            dayOfWeek: data.dayOfWeek,
            startTime: { lt: data.endTime },
            endTime: { gt: data.startTime },
          },
          {
            // Check if teacher of this class/subject is busy
            class: {
              subjects: {
                some: {
                  subjectId: data.subjectId,
                  teacher: {
                    classes: {
                      some: {
                        class: {
                          timetable: {
                            some: {
                              dayOfWeek: data.dayOfWeek,
                              startTime: { lt: data.endTime },
                              endTime: { gt: data.startTime },
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    });

    if (conflicts) {
      throw new Error("Timetable conflict detected for teacher or class.");
    }

    return await prisma.timetable.create({
      data,
    });
  }

  static async getClassTimetable(classId: string) {
    return await prisma.timetable.findMany({
      where: { classId },
      include: {
        subject: true,
        class: true,
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });
  }
}
