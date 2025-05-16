import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import { useDispatch, useSelector } from 'react-redux';

export default function PatientHome() {
  const router = useRouter();

  const {user} = useSelector((state) => state.auth)

  const goTo = (path) => router.push(path);

  return (
    <SafeAreaView edges={['top']}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>Hi, {user?.name ? `, ${user.name}` : ''} 👋</Text>
      <Text style={styles.subtitle}>Let’s take care of you today</Text>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <MaterialCommunityIcons name="heart-pulse" size={40} color="#ef4444" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.heroTitle}>Log your vitals</Text>
          <Text style={styles.heroSubtext}>Don’t forget to check your blood pressure!</Text>
        </View>
      </View>

      {/* Quick Access */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.grid}>
        <FeatureCard icon="fitness" label="Health" onPress={() => goTo('/health')} />
        <FeatureCard icon="chatbubbles" label="Chat" onPress={() => goTo('/chat')} />
        <FeatureCard icon="alert-circle" label="Emergency" onPress={() => goTo('/screens/Emergency')} />
        <FeatureCard icon="person" label="Profile" onPress={() => goTo('/profile')} />
      </View>

      {/* Mood Check */}
      <Text style={styles.sectionTitle}>How do you feel today?</Text>
      <View style={styles.moodRow}>
        {['happy', 'neutral', 'sad'].map((mood, i) => (
          <TouchableOpacity key={i} style={styles.moodBtn}>
            <Ionicons
              name={mood === 'happy' ? 'happy-outline' : mood === 'neutral' ? 'sad-outline' : 'close-circle-outline'}
              size={28}
              color="#f59e0b"
            />
            <Text style={styles.moodText}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Upcoming Appointment */}
      <Text style={styles.sectionTitle}>Next Appointment</Text>
      <View style={styles.cardBox}>
        <FontAwesome6 name="user-doctor" size={24} color="#2563eb" />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontWeight: '600' }}>Dr. Sushmita Rana</Text>
          <Text style={{ color: '#6b7280' }}>Gynecologist – 13 May, 10:30 AM</Text>
        </View>
      </View>

      {/* Reminders */}
      <Text style={styles.sectionTitle}>Today’s Reminders</Text>
      <View style={styles.reminderCard}>
        <Ionicons name="medkit" size={20} color="#10b981" />
        <Text style={styles.reminderText}>Take your iron supplement at 3:00 PM</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Ionicons name={icon} size={28} color="white" />
      <Text style={styles.cardLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#f9fafb',
    flexGrow: 1,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: '#fff0f0',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#b91c1c',
  },
  heroSubtext: {
    fontSize: 14,
    color: '#7f1d1d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginVertical: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: colors.patient,
    paddingVertical: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    elevation: 2,
  },
  cardLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  moodBtn: {
    alignItems: 'center',
    backgroundColor: '#fffbea',
    padding: 12,
    borderRadius: 12,
    width: 90,
  },
  moodText: {
    marginTop: 6,
    textTransform: 'capitalize',
    fontSize: 14,
    color: '#92400e',
  },
  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 1,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    padding: 12,
    borderRadius: 10,
  },
  reminderText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#065f46',
  },
});
