import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { colors, fontFamilies, spacing, borderRadius, statusBarHeight } from '@/constants/theme';
import SettingsItem from '@/components/SettingsItem';
import {
  Bell,
  Clock,
  Calendar,
  HelpCircle,
  Info,
  RefreshCw,
  Settings as SettingsIcon,
  Award,
  ArrowLeft
} from 'lucide-react-native';
import { getUserSettings, saveUserSettings, UserSettings, DEFAULT_SETTINGS, clearAllData } from '@/utils/storage';
import { scheduleReminderNotification } from '@/utils/notifications';

export default function SettingsScreen() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [tempTime, setTempTime] = useState('10:00');
  const [confirmResetVisible, setConfirmResetVisible] = useState(false);

  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const userSettings = await getUserSettings();
        setSettings(userSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings when notifications toggle changes
  const handleNotificationsToggle = async (value: boolean) => {
    try {
      const updatedSettings = { ...settings, notificationsEnabled: value };
      setSettings(updatedSettings);
      await saveUserSettings(updatedSettings);
      await scheduleReminderNotification();
    } catch (error) {
      console.error('Error saving notification setting:', error);
    }
  };

  // Open time picker
  const handleTimePress = () => {
    setTempTime(settings.reminderTime);
    setTimePickerVisible(true);
  };

  // Save time setting
  const handleSaveTime = async () => {
    try {
      const updatedSettings = { ...settings, reminderTime: tempTime };
      setSettings(updatedSettings);
      await saveUserSettings(updatedSettings);
      await scheduleReminderNotification();
      setTimePickerVisible(false);
    } catch (error) {
      console.error('Error saving time setting:', error);
    }
  };

  // Format time for display
  const formatTimeForDisplay = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);

    if (Platform.OS === 'ios') {
      // 12-hour format for iOS
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } else {
      // 24-hour format for Android
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  };

  // Handle resetting all data
  const handleResetData = async () => {
    try {
      await clearAllData();
      setConfirmResetVisible(false);
      Alert.alert(
        'Data Reset',
        'All tracking data has been reset successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error resetting data:', error);
      Alert.alert(
        'Error',
        'Failed to reset data. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <SettingsIcon size={24} color={colors.primary[600]} />
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Bell size={20} color={colors.primary[600]} />}
              title="Notifications"
              description="Enable daily reminders"
              switchValue={settings.notificationsEnabled}
              onSwitchChange={handleNotificationsToggle}
            />
            <SettingsItem
              icon={<Clock size={20} color={colors.secondary[500]} />}
              title="Reminder Time"
              description={`Set at ${formatTimeForDisplay(settings.reminderTime)}`}
              onPress={handleTimePress}
              last={true}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon={<Info size={20} color={colors.gray[600]} />}
              title="About"
              description="App version and information"
              onPress={() => { }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={timePickerVisible}
        onRequestClose={() => setTimePickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Reminder Time</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setTimePickerVisible(false)}
              >
                <ArrowLeft size={24} color={colors.gray[700]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.timePickerLabel}>
              Choose when you want to be reminded to take your daily creatine:
            </Text>

            <View style={styles.timeInputContainer}>
              <TextInput
                style={styles.timeInput}
                value={tempTime}
                onChangeText={setTempTime}
                placeholder="HH:MM"
                keyboardType="numbers-and-punctuation"
              />
              <Text style={styles.timeFormatHelp}>
                Enter time in 24-hour format (e.g., 10:00, 18:30)
              </Text>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveTime}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmResetVisible}
        onRequestClose={() => setConfirmResetVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmTitle}>Reset All Data?</Text>
            <Text style={styles.confirmText}>
              This will erase all your tracking history, streak data, and settings.
              This action cannot be undone.
            </Text>

            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setConfirmResetVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, styles.resetButton]}
                onPress={handleResetData}
              >
                <Text style={styles.resetButtonText}>Reset Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.gray[100],
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: colors.white,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    color: colors.gray[800],
    marginLeft: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    color: colors.gray[600],
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginHorizontal: spacing.md,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl + (Platform.OS === 'ios' ? spacing.xl : 0),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    color: colors.gray[800],
  },
  closeButton: {
    padding: spacing.xs,
  },
  timePickerLabel: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    color: colors.gray[700],
    marginBottom: spacing.md,
  },
  timeInputContainer: {
    marginVertical: spacing.lg,
  },
  timeInput: {
    fontFamily: fontFamilies.medium,
    fontSize: 32,
    color: colors.gray[800],
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  timeFormatHelp: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary[500],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: colors.white,
  },
  confirmModalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    margin: spacing.lg,
  },
  confirmTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    color: colors.gray[800],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  confirmText: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    color: colors.gray[700],
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  cancelButton: {
    backgroundColor: colors.gray[200],
  },
  resetButton: {
    backgroundColor: colors.error[500],
  },
  cancelButtonText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    color: colors.gray[700],
  },
  resetButtonText: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    color: colors.white,
  },
});