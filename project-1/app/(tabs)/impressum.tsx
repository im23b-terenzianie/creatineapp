import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fontFamilies, spacing } from '@/constants/theme';

const Impressum = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Impressum</Text>
        <Text style={styles.text}>
          This application is developed by [Your Name/Company].
        </Text>
        <Text style={styles.text}>
          Address: [Your Address]
        </Text>
        <Text style={styles.text}>
          Contact: [Your Contact Information]
        </Text>
        <Text style={styles.text}>
          © [Year] [Your Name/Company]. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    padding: spacing.md,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    elevation: 2,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    color: colors.gray[800],
    marginBottom: spacing.md,
  },
  text: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
});

export default Impressum;