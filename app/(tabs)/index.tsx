import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, Platform } from 'react-native';
import { colors, fontFamilies, spacing, borderRadius, statusBarHeight } from '@/constants/theme';
import StreakCounter from '@/components/StreakCounter';
import ConfirmButton from '@/components/ConfirmButton';
import { useStreak } from '@/hooks/useStreak';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'lucide-react-native';

export default function HomeScreen() {
  const { 
    streakData, 
    takenToday, 
    loading, 
    recordIntake,
    refreshStreak
  } = useStreak();
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleTakeCreatine = async () => {
    if (!takenToday) {
      await recordIntake(true, notes);
      setNotes('');
      setShowNotes(false);
      refreshStreak(); // Add this to ensure streak is updated
    }
  };

  const getCurrentDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const date = new Date();
    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    
    return `${dayOfWeek}, ${month} ${dayOfMonth}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.primary[500], colors.primary[700]]}
          style={styles.header}
        >
          <View style={styles.dateContainer}>
            <Calendar size={20} color={colors.white} />
            <Text style={styles.date}>{getCurrentDate()}</Text>
          </View>
          <Text style={styles.title}>Creatine Tracker</Text>
        </LinearGradient>

        <View style={styles.content}>
          <StreakCounter
            streakData={streakData}
            takenToday={takenToday}
          />

          <View style={styles.reminderContainer}>
            <Text style={styles.reminderText}>
              {takenToday 
                ? "Great job! You've taken your creatine today."
                : "Don't forget to take your daily creatine!"}
            </Text>
          </View>

          {!takenToday && showNotes && (
            <View style={styles.notesInputContainer}>
              <Text style={styles.notesHeader}>Add notes (optional):</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="How are you feeling today?"
                multiline
                placeholderTextColor={colors.gray[400]}
              />
            </View>
          )}

          <ConfirmButton 
            onPress={!showNotes ? () => setShowNotes(true) : handleTakeCreatine}
            disabled={loading} 
            taken={takenToday}
          />

          {takenToday && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Creatine Tips:</Text>
              <Text style={styles.tipText}>
                • Mix with water or juice for best absorption
              </Text>
              <Text style={styles.tipText}>
                • Consistency is key for optimal results
              </Text>
              <Text style={styles.tipText}>
                • Stay well hydrated throughout the day
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl + spacing.md,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    color: colors.white,
    marginLeft: spacing.xs,
    opacity: 0.8,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    color: colors.white,
    marginTop: spacing.sm,
  },
  content: {
    flex: 1,
    marginTop: -spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  reminderContainer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderText: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.gray[700],
    textAlign: 'center',
  },
  notesInputContainer: {
    width: '90%',
    marginBottom: spacing.md,
  },
  notesHeader: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  notesInput: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    color: colors.gray[800],
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  tipsContainer: {
    backgroundColor: colors.gray[100],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    width: '80%',
  },
  tipsTitle: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  tipText: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.gray[700],
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
});