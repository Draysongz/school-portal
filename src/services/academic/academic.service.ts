import prisma from '@/lib/prisma';

export class AcademicService {
  static async createAcademicYear(data: {
    name: string;
    startDate: Date;
    endDate: Date;
    schoolId: string;
    isCurrent?: boolean;
  }) {
    return await prisma.$transaction(async (tx) => {
      if (data.isCurrent) {
        // Reset current flag for others in the same school
        await tx.academicYear.updateMany({
          where: { schoolId: data.schoolId },
          data: { isCurrent: false },
        });
      }

      return await tx.academicYear.create({
        data,
      });
    });
  }

  static async getAcademicYears(schoolId: string) {
    return await prisma.academicYear.findMany({
      where: { schoolId },
      include: { terms: true },
      orderBy: { startDate: 'desc' },
    });
  }

  static async createClass(data: {
    name: string;
    gradeLevel: number;
    schoolId: string;
    academicYearId: string;
  }) {
    return await prisma.class.create({
      data,
    });
  }

  static async getClasses(schoolId: string, academicYearId?: string) {
    return await prisma.class.findMany({
      where: {
        schoolId,
        academicYearId,
      },
      include: {
        _count: {
          select: { students: true }
        }
      }
    });
  }
}
