import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logoutDoctor } from '@/redux/slices/doctorAuthSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

export default function DoctorProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.doctorAuth);

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user.name,
    specialization: user.specialization,
    email: user.email,
  });
  const [profilePic, setProfilePic] = useState(user.profilePic || null);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('doctorToken'); // Clear doctor token
    await SecureStore.deleteItemAsync('doctorRefreshToken'); // Clear doctor refresh token
    dispatch(logoutDoctor()); // Update Redux state
    router.replace('/(auth)/(doctor)/login'); // Redirect to login page
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (field, value) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving data to backend:", editedData);

      const formData = new FormData();
      formData.append('name', editedData.name);
      formData.append('specialization', editedData.specialization);
      formData.append('email', editedData.email);

      if (profilePic) {
        const filename = profilePic.split('/').pop();
        const match = /\.([^.]+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('profilePic', {
          uri: profilePic,
          name: filename,
          type,
        });
      }

      const token = await SecureStore.getItemAsync('doctorToken');

      const response = await fetch(`http://localhost:8000/api/doctors/${user._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      console.log("Profile updated successfully:", updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={handleImagePick}>
            <Image
              source={profilePic ? { uri: profilePic } : require('@/assets/images/pregnant.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={editedData.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                value={editedData.specialization}
                onChangeText={(text) => handleChange('specialization', text)}
                placeholder="Specialization"
              />
            </>
          ) : (
            <>
              <Text style={styles.name}>{editedData.name}</Text>
              <Text style={styles.specialization}>{editedData.specialization}</Text>
            </>
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#4A90E2" />
            {isEditing ? (
              <TextInput
                style={styles.inputInline}
                value={editedData.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="Email"
              />
            ) : (
              <Text style={styles.infoText}>{editedData.email}</Text>
            )}
          </View>
          <View style={styles.infoRow}>
            <Feather name="phone" size={20} color="#4A90E2" />
            <Text style={styles.infoText}>+91 98765 43210</Text>
          </View>
        </View>

        {/* Professional Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Professional Info</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#4A90E2" />
            <Text style={styles.infoText}>{user.workplace} </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="medkit-outline" size={20} color="#4A90E2" />
            <Text style={styles.infoText}>{user.levelOfStudy} </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditToggle}>
            <Ionicons name={isEditing ? "close-outline" : "create-outline"} size={20} color="#4A90E2" />
            <Text style={styles.actionText}>{isEditing ? 'Cancel' : 'Edit Profile'}</Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Ionicons name="save-outline" size={20} color="green" />
              <Text style={[styles.actionText, { color: 'green' }]}>Save Changes</Text>
            </TouchableOpacity>
          )}

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputInline: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    paddingVertical: 4,
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
    marginHorizontal:10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
  },
});
