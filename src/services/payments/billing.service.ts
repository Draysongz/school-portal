import prisma from '@/lib/prisma';

export class BillingService {
  static async createPlan(data: {
    name: string;
    price: number;
    interval: string;
    features?: any;
  }) {
    return await prisma.plan.create({ data });
  }

  static async subscribeSchool(schoolId: string, planId: string) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error("Plan not found");

    return await prisma.subscription.upsert({
      where: { schoolId },
      update: {
        planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (plan.interval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
      },
      create: {
        schoolId,
        planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (plan.interval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
      }
    });
  }

  static async getSchoolSubscription(schoolId: string) {
    return await prisma.subscription.findUnique({
      where: { schoolId },
      include: { plan: true }
    });
  }
}
