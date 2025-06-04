import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import axios from '@/utils/axiosInstance';

const EMERGENCY_CONTACTS = [
  { id: 'husband', label: 'Husband' },
  { id: 'doctor', label: 'Doctor' },
  { id: 'relative1', label: 'Relative 1' },
  { id: 'relative2', label: 'Relative 2' },
  { id: 'other', label: 'Other' },
];

export default function EmergencyScreen() {
  const [selectedContacts, setSelectedContacts] = useState([]);

  const toggleContact = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSendAlert = async () => {
    if (selectedContacts.length === 0) {
      Alert.alert('Error', 'Please select at least one contact to alert.');
      return;
    }

    try {
      const response = await axios.post('/api/emergency/send-alert', {
        message: 'I need help',
        contacts: selectedContacts,
      });

      if (response.status === 200) {
        Alert.alert('Emergency Alert Sent!', 'Your emergency message has been sent successfully.');
        setSelectedContacts([]); // Reset selection after sending
        router.back();
      } else {
        Alert.alert('Error', 'Failed to send the emergency alert. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while sending the emergency alert.');
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>🚨 Emergency Assistance</Text>

        <View style={styles.contactList}>
          <Text style={{ fontSize: 18, marginBottom: 10, color: '#666' }}>Select people to alert:</Text>
          {EMERGENCY_CONTACTS.map((contact) => (
            <TouchableOpacity
              key={contact.id}
              onPress={() => toggleContact(contact.id)}
              style={styles.contactItem}
            >
              <Ionicons
                name={
                  selectedContacts.includes(contact.id)
                    ? 'checkbox-outline'
                    : 'square-outline'
                }
                size={24}
                color="#e53935"
                style={styles.contactIcon}
              />
              <Text style={styles.contactLabel}>{contact.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSendAlert}
          style={styles.alertButton}
        >
          <Text style={styles.alertButtonText}>🚨 Send Emergency Alert</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  contactList: {
    marginBottom: 30,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactLabel: {
    fontSize: 16,
    color: '#555',
  },
  alertButton: {
    backgroundColor: '#e53935',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#e53935',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
