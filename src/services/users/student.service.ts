import prisma from '@/lib/prisma';
import { UserService } from './user.service';

export class StudentService {
  static async createStudent(data: {
    email: string;
    firstName: string;
    lastName: string;
    schoolId: string;
    classId?: string;
  }) {
    const { profile } = await UserService.createUserInSchool({
      ...data,
      role: 'STUDENT',
    });

    return await prisma.student.create({
      data: {
        profileId: profile.id,
        classId: data.classId,
      },
    });
  }

  static async getStudentsInSchool(schoolId: string) {
    return await prisma.student.findMany({
      where: {
        profile: { schoolId },
      },
      include: {
        profile: {
          include: {
            user: {
              select: { email: true }
            }
          }
        },
        class: true,
      },
    });
  }
}
