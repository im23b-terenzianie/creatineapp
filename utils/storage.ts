import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, addDays, isSameDay, parseISO } from 'date-fns';

// Storage keys
export const STORAGE_KEYS = {
  INTAKE_HISTORY: 'creatine_intake_history',
  STREAK_DATA: 'creatine_streak_data',
  SETTINGS: 'creatine_settings',
  LAST_UPDATED: 'creatine_last_updated',
};

// Interface for intake records
export interface IntakeRecord {
  date: string; // ISO date string
  taken: boolean;
  time?: string; // Time when taken
  notes?: string; // Optional notes
}

// Interface for streak data
export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  totalDaysTaken: number;
  lastTakenDate: string | null; // ISO date string or null
}

// Interface for user settings
export interface UserSettings {
  reminderTime: string; // Time in 24-hour format (HH:MM)
  notificationsEnabled: boolean;
  weeklyGoal: number; // Number of days per week to take creatine
}

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  reminderTime: '10:00',
  notificationsEnabled: true,
  weeklyGoal: 7, // Default is every day
};

// Default streak data
export const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  bestStreak: 0,
  totalDaysTaken: 0,
  lastTakenDate: null,
};

// Save intake record
export const saveIntakeRecord = async (record: IntakeRecord): Promise<void> => {
  try {
    // Get existing records
    const existingRecordsStr = await AsyncStorage.getItem(STORAGE_KEYS.INTAKE_HISTORY);
    const existingRecords: IntakeRecord[] = existingRecordsStr ? JSON.parse(existingRecordsStr) : [];
    
    // Check if record for this date already exists
    const existingIndex = existingRecords.findIndex(r => r.date === record.date);
    
    if (existingIndex >= 0) {
      // Update existing record
      existingRecords[existingIndex] = record;
    } else {
      // Add new record
      existingRecords.push(record);
    }
    
    // Sort records by date (newest first)
    existingRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Save updated records
    await AsyncStorage.setItem(STORAGE_KEYS.INTAKE_HISTORY, JSON.stringify(existingRecords));
    
    // Update last updated timestamp
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
  } catch (error) {
    console.error('Error saving intake record:', error);
    throw error;
  }
};

// Get all intake records
export const getIntakeRecords = async (): Promise<IntakeRecord[]> => {
  try {
    const recordsStr = await AsyncStorage.getItem(STORAGE_KEYS.INTAKE_HISTORY);
    return recordsStr ? JSON.parse(recordsStr) : [];
  } catch (error) {
    console.error('Error getting intake records:', error);
    return [];
  }
};

// Get intake record for a specific date
export const getIntakeForDate = async (date: string): Promise<IntakeRecord | null> => {
  try {
    const records = await getIntakeRecords();
    return records.find(r => r.date === date) || null;
  } catch (error) {
    console.error('Error getting intake for date:', error);
    return null;
  }
};

// Save streak data
export const saveStreakData = async (data: StreakData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving streak data:', error);
    throw error;
  }
};

// Get streak data
export const getStreakData = async (): Promise<StreakData> => {
  try {
    const streakDataStr = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);
    return streakDataStr ? JSON.parse(streakDataStr) : DEFAULT_STREAK_DATA;
  } catch (error) {
    console.error('Error getting streak data:', error);
    return DEFAULT_STREAK_DATA;
  }
};

// Save user settings
export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

// Get user settings
export const getUserSettings = async (): Promise<UserSettings> => {
  try {
    const settingsStr = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settingsStr ? JSON.parse(settingsStr) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting user settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// Record creatine intake for today
export const recordIntakeForToday = async (taken: boolean, notes?: string): Promise<void> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentTime = format(new Date(), 'HH:mm');
  
  // Create record
  const record: IntakeRecord = {
    date: today,
    taken,
    time: currentTime,
    notes,
  };
  
  // Save record
  await saveIntakeRecord(record);
  
  // Update streak data
  await updateStreakData(record);
};

// Update streak data based on new intake record
export const updateStreakData = async (newRecord: IntakeRecord): Promise<StreakData> => {
  try {
    // Get current streak data
    const currentStreakData = await getStreakData();
    
    // If intake was not taken, reset streak
    if (!newRecord.taken) {
      const newStreakData: StreakData = {
        ...currentStreakData,
        currentStreak: 0,
        lastTakenDate: null,
      };
      await saveStreakData(newStreakData);
      return newStreakData;
    }
    
    const recordDate = parseISO(newRecord.date);
    let newStreakData = { ...currentStreakData };

    // If this is the first time taking creatine
    if (!currentStreakData.lastTakenDate) {
      newStreakData = {
        currentStreak: 1,
        bestStreak: 1,
        totalDaysTaken: 1,
        lastTakenDate: newRecord.date,
      };
    } else {
      const lastTakenDate = parseISO(currentStreakData.lastTakenDate);
      const expectedNextDay = addDays(lastTakenDate, 1);

      // If taken on the expected next day or the same day
      if (isSameDay(recordDate, expectedNextDay) || isSameDay(recordDate, lastTakenDate)) {
        newStreakData.currentStreak = isSameDay(recordDate, lastTakenDate) 
          ? currentStreakData.currentStreak 
          : currentStreakData.currentStreak + 1;
        newStreakData.totalDaysTaken = isSameDay(recordDate, lastTakenDate)
          ? currentStreakData.totalDaysTaken
          : currentStreakData.totalDaysTaken + 1;
        newStreakData.lastTakenDate = newRecord.date;
        
        // Update best streak if current is better
        if (newStreakData.currentStreak > newStreakData.bestStreak) {
          newStreakData.bestStreak = newStreakData.currentStreak;
        }
      } else {
        // Streak broken, start new streak
        newStreakData = {
          currentStreak: 1,
          bestStreak: Math.max(currentStreakData.bestStreak, 1),
          totalDaysTaken: currentStreakData.totalDaysTaken + 1,
          lastTakenDate: newRecord.date,
        };
      }
    }
    
    // Save updated streak data
    await saveStreakData(newStreakData);
    return newStreakData;
  } catch (error) {
    console.error('Error updating streak data:', error);
    return DEFAULT_STREAK_DATA;
  }
};

// Get intake status for today
export const getTodayIntakeStatus = async (): Promise<boolean> => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const record = await getIntakeForDate(today);
  return record?.taken || false;
};

// Clear all data (for testing or reset)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.INTAKE_HISTORY,
      STORAGE_KEYS.STREAK_DATA,
      STORAGE_KEYS.SETTINGS,
      STORAGE_KEYS.LAST_UPDATED,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};