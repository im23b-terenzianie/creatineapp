import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  ViewStyle
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, fontFamilies, spacing, borderRadius } from '@/constants/theme';

interface ConfirmButtonProps {
  onPress: () => void;
  disabled?: boolean;
  taken?: boolean;
  style?: ViewStyle;
}

export default function ConfirmButton({
  onPress,
  disabled = false,
  taken = false,
  style
}: ConfirmButtonProps) {

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!disabled && !taken) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [disabled, taken]);

  const handlePress = () => {

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }


    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };


  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.5],
  });

  // Determine button style based on state
  const getButtonStyle = () => {
    if (taken) {
      return styles.buttonTaken;
    }
    if (disabled) {
      return styles.buttonDisabled;
    }
    return styles.button;
  };


  const getTextStyle = () => {
    if (taken) {
      return styles.textTaken;
    }
    if (disabled) {
      return styles.textDisabled;
    }
    return styles.text;
  };

  return (
    <Animated.View
      style={[
        styles.buttonContainer,
        {
          transform: [{ scale: scaleAnim }],
          shadowOpacity: taken || disabled ? 0.2 : shadowOpacity,
        },
        style
      ]}
    >
      <TouchableOpacity
        style={[styles.touchable, getButtonStyle()]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={getTextStyle()}>
          {taken ? 'Taken Today ✓' : 'Take Creatine'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: borderRadius.full,
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 5,
    marginVertical: spacing.lg,
  },
  touchable: {
    borderRadius: borderRadius.full,
    padding: spacing.md,
    paddingHorizontal: spacing.xl,
    minWidth: 200,
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.primary[500],
  },
  buttonDisabled: {
    backgroundColor: colors.gray[300],
  },
  buttonTaken: {
    backgroundColor: colors.success[500],
  },
  text: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    textAlign: 'center',
  },
  textDisabled: {
    color: colors.gray[500],
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    textAlign: 'center',
  },
  textTaken: {
    color: colors.white,
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    textAlign: 'center',
  },
});
