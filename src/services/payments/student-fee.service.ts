import prisma from '@/lib/prisma';

export class StudentFeeService {
  static async assignFee(data: {
    studentId: string;
    schoolId: string;
    amount: number;
    dueDate: Date;
    category: string;
  }) {
    return await prisma.studentFee.create({
      data: {
        ...data,
        status: 'UNPAID',
      }
    });
  }

  static async getStudentBalances(studentId: string) {
    const fees = await prisma.studentFee.findMany({
      where: { studentId },
      orderBy: { dueDate: 'asc' }
    });

    const totalDue = fees.reduce((sum, fee) => sum + (fee.amount - fee.paidAmount), 0);
    return { fees, totalDue };
  }
}
