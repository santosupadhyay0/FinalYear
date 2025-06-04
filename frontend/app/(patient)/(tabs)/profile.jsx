import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logoutPatient } from '@/redux/slices/patientAuthSlice'; // Update path if needed
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';


export default function ProfileScreen() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('patientToken'); // Clear patient token
    await SecureStore.deleteItemAsync('patientRefreshToken'); // Clear patient refresh token
    dispatch(logoutPatient()); // Update Redux state
    router.replace('/(auth)/login'); // Redirect to login page
  };

  const {user} = useSelector((state)=>state.patientAuth)

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Feather name="edit-2" size={16} color="#fff" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Info Cards */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>General Info</Text>

        <View style={styles.card}>
          <Ionicons name="person-outline" size={22} color="#6366f1" />
          <Text style={styles.cardText}>Age: 28</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="female-outline" size={22} color="#ec4899" />
          <Text style={styles.cardText}>Gender: Female</Text>
        </View>

        <View style={styles.card}>
          <MaterialIcons name="location-on" size={22} color="#f59e0b" />
          <Text style={styles.cardText}>Location: Kathmandu, Nepal</Text>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.card}>
          <Ionicons name="notifications-outline" size={22} color="#10b981" />
          <Text style={styles.cardText}>Notifications</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="lock-closed-outline" size={22} color="#8b5cf6" />
          <Text style={styles.cardText}>Privacy & Security</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
  },
  email: {
    color: '#6b7280',
    marginBottom: 8,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  editText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
});
