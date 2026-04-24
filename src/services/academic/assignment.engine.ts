import prisma from '@/lib/prisma';

export class AssignmentEngine {
  static async assignTeacherToSubject(data: {
    teacherId: string;
    classId: string;
    subjectId: string;
  }) {
    return await prisma.classSubject.upsert({
      where: {
        classId_subjectId: {
          classId: data.classId,
          subjectId: data.subjectId,
        },
      },
      update: {
        teacherId: data.teacherId,
      },
      create: {
        classId: data.classId,
        subjectId: data.subjectId,
        teacherId: data.teacherId,
      },
    });
  }

  static async enrollStudentInClass(studentId: string, classId: string) {
    return await prisma.student.update({
      where: { id: studentId },
      data: { classId },
    });
  }
}
