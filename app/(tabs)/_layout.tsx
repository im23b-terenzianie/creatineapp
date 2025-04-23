import { Tabs } from 'expo-router/tabs';
import { 
  Home as HomeIcon, 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon 
} from 'lucide-react-native';
import { colors, fontFamilies } from '@/constants/theme';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          paddingTop: Platform.OS === 'ios' ? 10 : 0,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          height: Platform.OS === 'ios' ? 85 : 65,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
          shadowColor: colors.black,
          shadowOpacity: 0.05,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -5 },
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontFamily: fontFamilies.medium,
          fontSize: 12,
          marginTop: 0,
          marginBottom: Platform.OS === 'ios' ? 5 : 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <CalendarIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <SettingsIcon size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}