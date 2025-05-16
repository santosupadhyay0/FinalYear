import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HealthDashboard() {
  const router = useRouter();

  const goToRecord = (recordType) => {
    router.push(`/health/${recordType}`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Health Overview</Text>
      <Text style={styles.subtitle}>Track your vitals and stay informed</Text>

      {/* Vital Summary Cards */}
      <View style={styles.cardsRow}>
        <VitalCard icon="heart" label="BP" value="118/78" unit="mmHg" color="#f87171" />
        <VitalCard icon="thermometer" label="Temp" value="98.6" unit="°F" color="#fb923c" />
      </View>
      <View style={styles.cardsRow}>
        <VitalCard icon="drop" label="Glucose" value="95" unit="mg/dL" color="#34d399" />
        <VitalCard icon="scale-bathroom" label="Weight" value="62.5" unit="kg" color="#60a5fa" />
      </View>

      {/* Add Record Buttons */}
      <Text style={styles.sectionTitle}>Quick Log</Text>
      <View style={styles.logRow}>
        <LogButton label="Log BP" icon="blood-pressure" onPress={() => goToRecord('bp')} />
        <LogButton label="Log Weight" icon="weight" onPress={() => goToRecord('weight')} />
        <LogButton label="Log Sugar" icon="candycane" onPress={() => goToRecord('glucose')} />
      </View>

      {/* Trend Section */}
      <Text style={styles.sectionTitle}>Recent Trends</Text>
      <View style={styles.trendCard}>
        <Text style={styles.trendLabel}>Weight</Text>
        <Text style={styles.trendValue}>+0.5 kg in last 7 days</Text>
        <View style={styles.trendChartPlaceholder}>
          <Text style={{ color: '#9ca3af' }}>📊 Graph Placeholder</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function VitalCard({ icon, label, value, unit, color }) {
  return (
    <View style={[styles.vitalCard, { backgroundColor: `${color}22` }]}>
      <View style={styles.vitalHeader}>
        <FontAwesome6 name={icon} size={20} color={color} />
        <Text style={styles.vitalLabel}>{label}</Text>
      </View>
      <Text style={[styles.vitalValue, { color }]}>{value}</Text>
      <Text style={styles.vitalUnit}>{unit}</Text>
    </View>
  );
}

function LogButton({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.logButton} onPress={onPress}>
      <MaterialCommunityIcons name={icon} size={26} color="#2563eb" />
      <Text style={styles.logLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  vitalCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    elevation: 1,
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  vitalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  vitalValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  vitalUnit: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 10,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logButton: {
    flex: 1,
    backgroundColor: '#eef2ff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  logLabel: {
    marginTop: 6,
    color: '#1e3a8a',
    fontWeight: '500',
  },
  trendCard: {
    backgroundColor: '#fef9c3',
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  trendLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
  },
  trendValue: {
    color: '#78350f',
    marginBottom: 10,
  },
  trendChartPlaceholder: {
    backgroundColor: '#fefce8',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
});
