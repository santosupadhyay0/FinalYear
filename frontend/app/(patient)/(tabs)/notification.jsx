import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const notifications = [
    {
      id: 1,
      title: 'Upcoming Checkup',
      message: 'You have a checkup scheduled on May 15th at 10:00 AM.',
      time: '2h ago',
      icon: 'calendar-outline',
      type: 'reminder',
      read: false,
    },
    {
      id: 2,
      title: 'Daily Health Tip',
      message: 'Drink 2L of water today and take 30 min walk 🚶‍♀️',
      time: '6h ago',
      icon: 'heart-circle-outline',
      type: 'tip',
      read: false,
    },
    {
      id: 3,
      title: 'Emergency Alert',
      message: 'High blood pressure detected. Please consult a doctor immediately!',
      time: '1d ago',
      icon: 'alert-circle-outline',
      type: 'alert',
      read: true,
    },
    {
      id: 4,
      title: 'New Message from Dr. Sharma',
      message: 'Hey! Please update your blood sugar readings before tomorrow.',
      time: '2d ago',
      icon: 'chatbox-ellipses-outline',
      type: 'message',
      read: true,
    },
  ];

  const getColorByType = (type) => {
    switch (type) {
      case 'reminder':
        return '#34d399';
      case 'alert':
        return '#f87171';
      case 'tip':
        return '#60a5fa';
      case 'message':
        return '#facc15';
      default:
        return '#d1d5db';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {notifications.map((n) => (
        <TouchableOpacity key={n.id} style={[styles.card, !n.read && styles.unreadCard]}>
          <View style={styles.iconContainer}>
            <Ionicons name={n.icon} size={28} color={getColorByType(n.type)} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{n.title}</Text>
            <Text style={styles.message}>{n.message}</Text>
            <Text style={styles.time}>{n.time}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  iconContainer: {
    marginRight: 14,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1f2937',
  },
  message: {
    fontSize: 14,
    color: '#4b5563',
    marginVertical: 4,
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
