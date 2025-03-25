import { LocalNotifications } from '@capacitor/local-notifications';
import { ApiService } from './ApiService';

export class NotificationService {
  static async initialize() {
    await LocalNotifications.requestPermissions();
    await this.scheduleNotification();
  }

  private static async scheduleNotification() {
    const now = new Date();
    const notificationTime = new Date(now);
    notificationTime.setHours(11, 0, 0, 0); // Set to 11:00 AM

    // If it's already past 11:00 AM, schedule for tomorrow
    if (now > notificationTime) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Time to walk Mason!",
          body: "Don't forget to take Mason for his morning walk.",
          id: 1,
          schedule: { at: notificationTime },
        },
      ],
    });
  }

  static async checkAndNotify() {
    const record = await ApiService.getTodayRecord();
    if (!record?.walked) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Mason needs a walk!",
            body: "It's getting late. Please take Mason for his walk.",
            id: 2,
            schedule: { at: new Date() },
          },
        ],
      });
    }
  }
} 