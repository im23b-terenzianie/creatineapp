import { Notifications } from 'expo-notifications';

export const scheduleReminderNotification = async (time: string) => {
  const trigger = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  trigger.setHours(hours);
  trigger.setMinutes(minutes);
  trigger.setSeconds(0);
  trigger.setMilliseconds(0);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to take your creatine!",
      body: "Don't forget to take your daily dose of creatine.",
      sound: 'default',
    },
    trigger,
  });
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};