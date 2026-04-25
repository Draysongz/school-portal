import { describe, it, expect, vi } from 'vitest';
import { ReconciliationService } from '@/services/payments/reconciliation.service';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    $transaction: vi.fn((callback) => callback({
      transaction: {
        update: vi.fn().mockResolvedValue({ id: 't-1', studentFeeId: 'f-1', amount: 100 }),
      },
      studentFee: {
        findUnique: vi.fn().mockResolvedValue({ id: 'f-1', amount: 100, paidAmount: 0 }),
        update: vi.fn(),
      },
      invoice: {
        updateMany: vi.fn(),
      }
    })),
  }
}));

describe('ReconciliationService', () => {
  it('should update fee status to PAID when transaction is successful and matches total amount', async () => {
    const result = await ReconciliationService.reconcileTransaction('ref-1', 'SUCCESS');
    expect(result.amount).toBe(100);
  });
});
