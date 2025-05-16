import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from '@/redux/slices/chatSlice';
import moment from 'moment';

export default function ChatListScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth)

  const { messages, loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    if (user?._id) {
      // You can customize this to pull with a list of contacts or chats
      dispatch(fetchMessages({ senderId: user._id, receiverId: '' })); // leave receiverId empty to fetch all conversations involving the user
    }
  }, [user]);

  const uniqueChats = {};

  // Reduce messages into a unique list by receiver/sender
  messages.forEach((msg) => {
    const otherUser =
      msg.senderId._id === user._id ? msg.receiverId : msg.senderId;

    if (!uniqueChats[otherUser._id]) {
      uniqueChats[otherUser._id] = {
        id: otherUser._id,
        name: otherUser.name || 'Unknown',
        lastMessage: msg.message,
        time: moment(msg.createdAt).calendar(),
        avatar: otherUser.avatar || 'https://i.pravatar.cc/150', // Fallback
      };
    }
  });

  const chatList = Object.values(uniqueChats);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      // onPress={() => router.push(`/screens/chat${item.id}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1f2937',
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});
