import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const messages = [
  {
    id: '1',
    name: 'Ritika Sharma',
    lastMessage: 'Thank you, doctor!',
    time: '10:45 AM',
    avatar: 'https://placeimg.com/100/100/people',
  },
  {
    id: '2',
    name: 'Anil Singh',
    lastMessage: 'I’ve uploaded my report',
    time: '9:30 AM',
    avatar: 'https://placeimg.com/101/101/people',
  },
  {
    id: '3',
    name: 'Meena Joshi',
    lastMessage: 'Can we schedule tomorrow?',
    time: 'Yesterday',
    avatar: 'https://placeimg.com/102/102/people',
  },
];

export default function DoctorMessages() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#4A90E2" />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
});
