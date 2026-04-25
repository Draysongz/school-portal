import prisma from '@/lib/prisma';

export class InvoiceService {
  static async generateInvoice(schoolId: string, studentFeeId: string) {
    const fee = await prisma.studentFee.findUnique({
      where: { id: studentFeeId },
    });

    if (!fee) throw new Error("Fee not found");

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return await prisma.invoice.create({
      data: {
        schoolId,
        studentFeeId,
        number: invoiceNumber,
        amount: fee.amount,
        status: 'OPEN',
        dueDate: fee.dueDate,
      }
    });
  }

  static async getSchoolInvoices(schoolId: string) {
    return await prisma.invoice.findMany({
      where: { schoolId },
      include: { studentFee: { include: { student: { include: { profile: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
