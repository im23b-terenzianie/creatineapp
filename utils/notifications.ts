import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getUserSettings } from './storage';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications
export async function registerForPushNotificationsAsync() {
  try {
    // Check if we're running on a device (not simulator)
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If we don't have permission yet, ask for it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If we still don't have permission, exit
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Set up notification categories / actions
    await Notifications.setNotificationCategoryAsync('CREATINE_REMINDER', [
      {
        identifier: 'TAKE_NOW',
        buttonTitle: 'Take Now',
        options: {
          isAuthenticationRequired: false,
          isDestructive: false,
        },
      },
      {
        identifier: 'SKIP_TODAY',
        buttonTitle: 'Skip Today',
        options: {
          isAuthenticationRequired: false,
          isDestructive: true,
        },
      },
    ]);

    // Get the user's settings (reminder time)
    await scheduleReminderNotification();
  } catch (error) {
    console.error('Error registering for push notifications:', error);
  }
}

// Schedule the daily reminder notification based on user settings
export async function scheduleReminderNotification() {
  try {
    // First, cancel any existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Get user settings
    const userSettings = await getUserSettings();
    
    // If notifications are disabled, don't schedule anything
    if (!userSettings.notificationsEnabled) {
      return;
    }

    // Parse reminder time
    const [hours, minutes] = userSettings.reminderTime.split(':').map(Number);

    // Create a trigger for daily notification at the specified time
    const trigger = {
      hour: hours,
      minute: minutes,
      repeats: true,
    };

    // Schedule the notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time for your creatine!",
        body: "Don't break your streak! Take your daily creatine now.",
        data: { type: 'creatine_reminder' },
        categoryIdentifier: 'CREATINE_REMINDER',
      },
      trigger,
    });

    console.log('Reminder notification scheduled for', `${hours}:${minutes}`);
  } catch (error) {
    console.error('Error scheduling reminder notification:', error);
  }
}

// Send immediate notification
export async function sendImmediateNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null, // null means send immediately
  });
}