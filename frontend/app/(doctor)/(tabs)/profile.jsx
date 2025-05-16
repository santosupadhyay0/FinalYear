import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice'; // Update path if needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';


export default function DoctorProfile() {
  const dispatch = useDispatch();
  const  {user}  = useSelector((state)=>state.auth)

  const handleLogout = async () => {
    await AsyncStorage.clear(); 
    dispatch(logout());
    router.replace('/(auth)/(doctor)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://placeimg.com/140/140/people' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.specialization}>{user.specialization}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#4A90E2" />
            <Text style={styles.infoText}>{user.email} </Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="phone" size={20} color="#4A90E2" />
            <Text style={styles.infoText}>+91 98765 43210</Text>
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Professional Info</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#4A90E2" />
            <Text style={styles.infoText}>Apollo Hospital, New Delhi</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="medkit-outline" size={20} color="#4A90E2" />
            <Text style={styles.infoText}>MBBS, MD (Cardiology)</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="settings-outline" size={20} color="#4A90E2" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="lock-closed-outline" size={20} color="#4A90E2" />
            <Text style={styles.actionText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.logout]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#E53935" />
            <Text style={[styles.actionText, { color: '#E53935' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 20,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  specialization: {
    fontSize: 14,
    color: '#888',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  actionContainer: {
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  actionText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  logout: {
    borderColor: '#E53935',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
});
