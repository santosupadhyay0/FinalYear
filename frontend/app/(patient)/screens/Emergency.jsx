import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

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

  const handleSendAlert = () => {
    if (selectedContacts.length === 0) {
      Alert.alert('Error', 'Please select at least one contact to alert.');
      return;
    }

    Alert.alert(
      'Emergency Alert Sent!',
      `Alert has been sent to: ${selectedContacts.map((c) =>
        EMERGENCY_CONTACTS.find((x) => x.id === c)?.label
      ).join(', ')}`
    );

    // Reset selection after sending
    setSelectedContacts([]);
        router.back()
  };

  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>
        Emergency Assistance
      </Text>

      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Select people to alert:</Text>
        {EMERGENCY_CONTACTS.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            onPress={() => toggleContact(contact.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}
          >
            <Ionicons
              name={
                selectedContacts.includes(contact.id)
                  ? 'checkbox-outline'
                  : 'square-outline'
              }
              size={24}
              color="#e53935"
              style={{ marginRight: 10 }}
            />
            <Text style={{ fontSize: 16 }}>{contact.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleSendAlert}
        style={{
          backgroundColor: '#e53935',
          padding: 18,
          borderRadius: 12,
          alignItems: 'center',
          shadowColor: '#e53935',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          🚨 Send Emergency Alert
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}
