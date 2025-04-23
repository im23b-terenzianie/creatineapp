import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  getStreakData, 
  StreakData, 
  recordIntakeForToday, 
  DEFAULT_STREAK_DATA,
  getTodayIntakeStatus,
  IntakeRecord,
  getIntakeRecords
} from '@/utils/storage';
import { sendImmediateNotification } from '@/utils/notifications';

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA);
  const [takenToday, setTakenToday] = useState<boolean>(false);
  const [intakeHistory, setIntakeHistory] = useState<IntakeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load streak data
  const loadStreakData = async () => {
    try {
      setLoading(true);
      const data = await getStreakData();
      const todayStatus = await getTodayIntakeStatus();
      const history = await getIntakeRecords();
      
      setStreakData(data);
      setTakenToday(todayStatus);
      setIntakeHistory(history);
      setError(null);
    } catch (err) {
      setError('Failed to load streak data. Please try again.');
      console.error('Error loading streak data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to record intake
  const recordIntake = async (taken: boolean, notes?: string) => {
    try {
      setLoading(true);
      await recordIntakeForToday(taken, notes);
      
      // Show appropriate notification
      if (taken) {
        const streak = streakData.currentStreak + 1;
        await sendImmediateNotification(
          'Creatine Taken! 💪',
          `Your current streak is now ${streak} ${streak === 1 ? 'day' : 'days'}!`
        );
      }
      
      // Refresh data
      await loadStreakData();
    } catch (err) {
      setError('Failed to record intake. Please try again.');
      console.error('Error recording intake:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to get all recorded dates
  const getRecordedDates = () => {
    return intakeHistory.reduce((acc, record) => {
      acc[record.date] = record.taken;
      return acc;
    }, {} as Record<string, boolean>);
  };

  // Function to manually record intake for a specific date
  const recordIntakeForDate = async (date: string, taken: boolean, notes?: string) => {
    try {
      setLoading(true);
      
      // Create record
      const record: IntakeRecord = {
        date,
        taken,
        time: format(new Date(), 'HH:mm'),
        notes,
      };
      
      await recordIntakeForToday(taken, notes);
      
      // Refresh data
      await loadStreakData();
    } catch (err) {
      setError('Failed to record intake for date. Please try again.');
      console.error('Error recording intake for date:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load streak data on component mount
  useEffect(() => {
    loadStreakData();
  }, []);

  return {
    streakData,
    takenToday,
    loading,
    error,
    recordIntake,
    refreshStreak: loadStreakData,
    intakeHistory,
    getRecordedDates,
    recordIntakeForDate,
  };
}