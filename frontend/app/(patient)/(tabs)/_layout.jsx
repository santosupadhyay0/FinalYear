import { Tabs } from 'expo-router';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';

export default function PatientTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.patient,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown:false,
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home-filled" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calendar-today" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}