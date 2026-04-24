import prisma from '@/lib/prisma';
import { UserService } from './user.service';

export class TeacherService {
  static async createTeacher(data: {
    email: string;
    firstName: string;
    lastName: string;
    schoolId: string;
  }) {
    const { profile } = await UserService.createUserInSchool({
      ...data,
      role: 'TEACHER',
    });

    return await prisma.teacher.create({
      data: {
        profileId: profile.id,
      },
    });
  }

  static async getTeachersInSchool(schoolId: string) {
    return await prisma.teacher.findMany({
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
        classes: {
          include: {
            class: true,
            subject: true,
          }
        }
      },
    });
  }
}
