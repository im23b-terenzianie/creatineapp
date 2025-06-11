import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontFamilies, spacing } from '@/constants/theme';

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  last?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  description,
  switchValue,
  onSwitchChange,
  onPress,
  last,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, last && styles.lastItem]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {onSwitchChange !== undefined && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: colors.gray[300], true: colors.primary[500] }}
          thumbColor={switchValue ? colors.white : colors.gray[400]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    color: colors.gray[800],
  },
  description: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.gray[600],
  },
});

export default SettingsItem;