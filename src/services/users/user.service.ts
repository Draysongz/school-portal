import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export class UserService {
  static async createUserInSchool(data: {
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    schoolId: string;
    password?: string;
  }) {
    const password = data.password || 'Temporary123!'; // Should be generated and sent via email
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.$transaction(async (tx) => {
      // 1. Upsert global user
      const user = await tx.user.upsert({
        where: { email: data.email },
        update: {}, // Don't update password if user already exists
        create: {
          email: data.email,
          passwordHash: hashedPassword,
          role: data.role,
        },
      });

      // 2. Create school-specific profile
      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          schoolId: data.schoolId,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });

      return { user, profile };
    });
  }

  static async getUsersInSchool(schoolId: string, role?: Role) {
    return await prisma.profile.findMany({
      where: {
        schoolId,
        user: role ? { role } : undefined,
      },
      include: {
        user: {
          select: {
            email: true,
            role: true,
            isActive: true, // Need to add isActive to User model if not there
          },
        },
      },
    });
  }

  static async deleteUserFromSchool(profileId: string, schoolId: string) {
    // Only delete the profile, not the global user
    return await prisma.profile.delete({
      where: {
        id: profileId,
        schoolId,
      },
    });
  }
}
