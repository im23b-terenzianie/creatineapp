export const colors = {
  primary: {
    500: '#6200ee',
    600: '#3700b3',
  },
  secondary: {
    500: '#03dac6',
  },
  gray: {
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    500: '#757575',
    600: '#616161',
    700: '#424242',
    800: '#212121',
  },
  white: '#ffffff',
  error: {
    500: '#b00020',
  },
};

export const fontFamilies = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  semiBold: 'System',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
};

export const statusBarHeight = Platform.OS === 'android' ? 25 : 20;