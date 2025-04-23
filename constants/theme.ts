import { Platform } from 'react-native';

export const colors = {
  primary: {
    50: '#EBF5FF',
    100: '#D6EBFF',
    200: '#ADD6FF',
    300: '#85C0FF',
    400: '#5CABFF',
    500: '#3396FF', // Main primary color
    600: '#0A7CFF',
    700: '#0062D6',
    800: '#004AAD',
    900: '#003380',
  },
  secondary: {
    50: '#F0FAFF',
    100: '#E0F5FF',
    200: '#BFE8FF',
    300: '#99D8FF',
    400: '#66C6FF',
    500: '#33B5FF', // Main secondary color
    600: '#0099F5',
    700: '#0076CC',
    800: '#0057A3',
    900: '#003B7A',
  },
  success: {
    50: '#E6F7ED',
    100: '#CCEEDD',
    200: '#99DDB8',
    300: '#66CC94',
    400: '#33BB6F',
    500: '#00AA4B', // Main success color
    600: '#008F3E',
    700: '#007531',
    800: '#005A25',
    900: '#004018',
  },
  warning: {
    50: '#FFF8E6',
    100: '#FFF1CC',
    200: '#FFE499',
    300: '#FFD666',
    400: '#FFC833',
    500: '#FFBA00', // Main warning color
    600: '#D69C00',
    700: '#AD7D00',
    800: '#855F00',
    900: '#5C4000',
  },
  error: {
    50: '#FEEBEB',
    100: '#FDD7D7',
    200: '#FBB0B0',
    300: '#F98888',
    400: '#F76060',
    500: '#F53939', // Main error color
    600: '#E01010',
    700: '#B80D0D',
    800: '#900A0A',
    900: '#680707',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280', // Main gray color
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const fontFamilies = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 56,
  '5xl': 64,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  xl: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const statusBarHeight = Platform.OS === 'ios' ? 50 : 0;