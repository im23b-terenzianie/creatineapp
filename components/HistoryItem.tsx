import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IntakeRecord } from '@/utils/storage';
import { colors, fontFamilies, spacing, borderRadius, shadows } from '@/constants/theme';
import { format, parseISO } from 'date-fns';
import { Check, X, Edit2 } from 'lucide-react-native';

interface HistoryItemProps {
  record: IntakeRecord;
  onEdit?: (record: IntakeRecord) => void;
}

export default function HistoryItem({ record, onEdit }: HistoryItemProps) {
  // Format the date for display
  const formattedDate = format(parseISO(record.date), 'EEE, MMM d, yyyy');
  
  return (
    <View style={[
      styles.container,
      record.taken ? styles.containerTaken : styles.containerMissed
    ]}>
      <View style={styles.iconContainer}>
        {record.taken ? (
          <Check size={20} color={colors.success[500]} />
        ) : (
          <X size={20} color={colors.error[500]} />
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.date}>{formattedDate}</Text>
        
        {record.time && (
          <Text style={styles.time}>
            {record.taken ? 'Taken at ' : 'Missed at '} 
            {record.time}
          </Text>
        )}
        
        {record.notes && (
          <Text style={styles.notes}>{record.notes}</Text>
        )}
      </View>
      
      {onEdit && (
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => onEdit(record)}
        >
          <Edit2 size={16} color={colors.gray[500]} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: spacing.sm / 2,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  containerTaken: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success[500],
  },
  containerMissed: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error[500],
  },
  iconContainer: {
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[100],
  },
  contentContainer: {
    flex: 1,
  },
  date: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    color: colors.gray[800],
  },
  time: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.gray[600],
    marginTop: spacing.xs / 2,
  },
  notes: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    color: colors.gray[600],
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  editButton: {
    justifyContent: 'center',
    padding: spacing.xs,
  },
});