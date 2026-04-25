import prisma from '@/lib/prisma';

export class ReconciliationService {
  static async reconcileTransaction(reference: string, status: 'SUCCESS' | 'FAILED') {
    return await prisma.$transaction(async (tx) => {
      // 1. Update Transaction
      const transaction = await tx.transaction.update({
        where: { reference },
        data: { status },
      });

      if (status === 'SUCCESS' && transaction.studentFeeId) {
        // 2. Update Student Fee
        const fee = await tx.studentFee.findUnique({ where: { id: transaction.studentFeeId } });
        if (fee) {
          const newPaidAmount = fee.paidAmount + transaction.amount;
          await tx.studentFee.update({
            where: { id: fee.id },
            data: {
              paidAmount: newPaidAmount,
              status: newPaidAmount >= fee.amount ? 'PAID' : 'PARTIAL',
            }
          });

          // 3. Update related Invoice
          await tx.invoice.updateMany({
            where: { studentFeeId: fee.id },
            data: { status: newPaidAmount >= fee.amount ? 'PAID' : 'OPEN' }
          });
        }
      }

      return transaction;
    });
  }
}
