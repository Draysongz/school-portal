import prisma from '@/lib/prisma';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export class NotificationService {
  static async sendNotification(data: {
    userId: string;
    schoolId: string;
    title: string;
    content: string;
  }) {
    // 1. Persist to DB
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        schoolId: data.schoolId,
        title: data.title,
        content: data.content,
      }
    });

    // 2. Trigger Real-time event
    await pusher.trigger(`user-${data.userId}`, 'notification:received', {
      id: notification.id,
      title: notification.title,
      content: notification.content,
      createdAt: notification.createdAt,
    });

    return notification;
  }
}
