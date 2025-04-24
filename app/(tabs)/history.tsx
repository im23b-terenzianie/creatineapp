import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  Platform, 
  TextInput,
  Modal
} from 'react-native';
import { colors, fontFamilies, spacing, borderRadius, statusBarHeight } from '@/constants/theme';
import { useStreak } from '@/hooks/useStreak';
import HistoryItem from '@/components/HistoryItem';
import { format, subDays, parseISO, isToday } from 'date-fns';
import { IntakeRecord } from '@/utils/storage';
import { ArrowLeft, Calendar, Check, X } from 'lucide-react-native';

export default function HistoryScreen() {
  const { intakeHistory, recordIntakeForDate, refreshStreak } = useStreak();
  const [selectedRecord, setSelectedRecord] = useState<IntakeRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState('');
  const [taken, setTaken] = useState(false);

  // Handle edit modal for a record
  const handleEditRecord = (record: IntakeRecord) => {
    setSelectedRecord(record);
    setNotes(record.notes || '');
    setTaken(record.taken);
    setModalVisible(true);
  };

  // Handle save changes to a record
  const handleSaveRecord = async () => {
    if (selectedRecord) {
      await recordIntakeForDate(selectedRecord.date, taken, notes);
      setModalVisible(false);
      refreshStreak();
    }
  };

  // Generate history for the last 7 days including days with no records
  const generateCompleteHistory = () => {
    const history: IntakeRecord[] = [];
    const recordedDates = new Map(intakeHistory.map(record => [record.date, record]));
    
    // Loop through last 7 days
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const record = recordedDates.get(date);
      
      if (record) {
        history.push(record);
      } else {
        // Create placeholder for days with no records
        history.push({
          date,
          taken: false,
          time: isToday(parseISO(date)) ? '23:59' : '00:00',
        });
      }
    }
    
    return history;
  };

  const completeHistory = generateCompleteHistory();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Calendar size={24} color={colors.primary[600]} />
        <Text style={styles.title}>History</Text>
      </View>
      
      <FlatList
        data={completeHistory}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <HistoryItem 
            record={item} 
            onEdit={handleEditRecord}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No history yet</Text>
          </View>
        }
      />
      
      {/* Edit Record Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedRecord ? format(parseISO(selectedRecord.date), 'EEEE, MMM d, yyyy') : ''}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <ArrowLeft size={24} color={colors.gray[700]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Did you take creatine this day?</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity 
                  style={[
                    styles.statusButton, 
                    taken ? styles.statusButtonActive : null
                  ]}
                  onPress={() => setTaken(true)}
                >
                  <Check size={20} color={taken ? colors.white : colors.gray[500]} />
                  <Text style={[
                    styles.statusButtonText,
                    taken ? styles.statusButtonTextActive : null
                  ]}>Yes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.statusButton, 
                    !taken ? styles.statusButtonActive : null,
                    !taken ? styles.statusButtonActiveDanger : null
                  ]}
                  onPress={() => setTaken(false)}
                >
                  <X size={20} color={!taken ? colors.white : colors.gray[500]} />
                  <Text style={[
                    styles.statusButtonText,
                    !taken ? styles.statusButtonTextActive : null
                  ]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="How did you feel this day?"
                multiline
                placeholderTextColor={colors.gray[400]}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveRecord}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
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
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.gray[500],
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
  statusContainer: {
    marginBottom: spacing.lg,
  },
  statusLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.gray[700],
    marginBottom: spacing.md,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    width: '48%',
  },
  statusButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  statusButtonActiveDanger: {
    backgroundColor: colors.error[500],
    borderColor: colors.error[500],
  },
  statusButtonText: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.gray[700],
    marginLeft: spacing.sm,
  },
  statusButtonTextActive: {
    color: colors.white,
  },
  notesContainer: {
    marginBottom: spacing.xl,
  },
  notesLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    color: colors.gray[700],
    marginBottom: spacing.sm,
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
});