import AsyncStorage from '@react-native-async-storage/async-storage';

export const DEFAULT_SETTINGS = {
  notificationsEnabled: true,
  reminderTime: '10:00',
};

export type UserSettings = {
  notificationsEnabled: boolean;
  reminderTime: string;
};

export const getUserSettings = async (): Promise<UserSettings> => {
  try {
    const settingsString = await AsyncStorage.getItem('userSettings');
    return settingsString ? JSON.parse(settingsString) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting user settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving user settings:', error);
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};