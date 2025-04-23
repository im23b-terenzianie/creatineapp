import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { colors, fontFamilies, spacing, borderRadius } from '@/constants/theme';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onPress?: () => void;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  last?: boolean;
}

export default function SettingsItem({
  icon,
  title,
  description,
  onPress,
  switchValue,
  onSwitchChange,
  last = false,
}: SettingsItemProps) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[
        styles.container,
        !last && styles.borderBottom,
        onPress && styles.pressable,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {onSwitchChange !== undefined && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{
            false: colors.gray[300],
            true: Platform.OS === 'ios' ? colors.primary[500] : colors.primary[400],
          }}
          thumbColor={
            Platform.OS === 'android'
              ? switchValue
                ? colors.primary[600]
                : colors.gray[100]
              : colors.white
          }
          ios_backgroundColor={colors.gray[300]}
        />
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  pressable: {
    cursor: 'pointer',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.gray[800],
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 2,
  },
});