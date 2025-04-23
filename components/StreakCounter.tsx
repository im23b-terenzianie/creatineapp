import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { StreakData } from '@/utils/storage';
import { colors, fontFamilies, spacing, shadows, borderRadius } from '@/constants/theme';
import { Trophy } from 'lucide-react-native';

interface StreakCounterProps {
  streakData: StreakData;
  takenToday: boolean;
}

export default function StreakCounter({ streakData, takenToday }: StreakCounterProps) {
  const { currentStreak, bestStreak, totalDaysTaken } = streakData;

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(0)).current;
  const [displayedCount, setDisplayedCount] = React.useState(0);

  // Animate when streak changes
  useEffect(() => {
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotate animation for celebration
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    // Count up animation
    if (currentStreak > displayedCount) {
      setDisplayedCount(0); // Reset to create the counting effect
      Animated.timing(countAnim, {
        toValue: currentStreak,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      setDisplayedCount(currentStreak);
    }
  }, [currentStreak]);

  // Listen to countAnim and update displayedCount
  useEffect(() => {
    const listener = countAnim.addListener(({ value }) => {
      setDisplayedCount(Math.floor(value));
    });
    return () => {
      countAnim.removeListener(listener);
    };
  }, [countAnim]);

  // Calculate rotation for celebration
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '-5deg', '0deg', '5deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.streakCardContainer}>
        <Animated.View
          style={[
            styles.streakCard,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: rotation },
              ],
            },
          ]}
        >
          <Text style={styles.streakLabel}>Current Streak</Text>
          <View style={styles.streakValueContainer}>
            <Text style={styles.streakValue}>{displayedCount}</Text>
            <Text style={styles.streakUnit}>days</Text>
          </View>
          {takenToday && <Text style={styles.takenToday}>✓ Taken today</Text>}
          {!takenToday && <Text style={styles.notTakenToday}>Not taken today</Text>}
        </Animated.View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Trophy color={colors.warning[500]} size={24} />
          </View>
          <Text style={styles.statValue}>{bestStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Trophy color={colors.primary[500]} size={24} />
          </View>
          <Text style={styles.statValue}>{totalDaysTaken}</Text>
          <Text style={styles.statLabel}>Total Days</Text>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    width: '100%',
  },
  streakCardContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  streakCard: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    width: width - spacing.xl * 2,
    ...shadows.lg,
  },
  streakLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.white,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  streakValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  streakValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 72,
    color: colors.white,
    lineHeight: 80,
  },
  streakUnit: {
    fontFamily: fontFamilies.medium,
    fontSize: 20,
    color: colors.white,
    marginBottom: 12,
    marginLeft: 4,
  },
  takenToday: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.success[300],
    marginTop: spacing.xs,
  },
  notTakenToday: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.warning[300],
    marginTop: spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.xl,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    width: '48%',
    ...shadows.md,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    color: colors.gray[800],
  },
  statLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
});