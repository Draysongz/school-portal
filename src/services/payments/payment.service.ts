import prisma from '@/lib/prisma';
import { StripeProvider } from './stripe.provider';
import { PaymentProvider } from './payment-provider.interface';

export class PaymentService {
  static getProvider(schoolId: string): PaymentProvider {
    // In a real app, fetch school-specific keys from DB
    // For Phase 6, we use an environment variable
    const apiKey = process.env.STRIPE_SECRET_KEY!;
    return new StripeProvider(apiKey);
  }

  static async initializeTransaction(data: {
    amount: number;
    email: string;
    schoolId: string;
    studentFeeId?: string;
  }) {
    const reference = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 1. Log pending transaction
    await prisma.transaction.create({
      data: {
        schoolId: data.schoolId,
        studentFeeId: data.studentFeeId,
        amount: data.amount,
        status: 'PENDING',
        provider: 'Stripe',
        reference,
      }
    });

    // 2. Initialize with provider
    const provider = this.getProvider(data.schoolId);
    return await provider.initialize({
      amount: data.amount,
      email: data.email,
      reference,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/verify?ref=${reference}`,
    });
  }
}
