import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatThreads } from '@/redux/slices/chatSlice';
import { useRouter } from 'expo-router';
import axios from 'axios';

const MessageScreen = () => {
  const currentUser = useSelector((state) => state.doctorAuth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const { threads, loading, error } = useSelector((state) => state.chat);

  const [search, setSearch] = useState('');
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchChatThreads(currentUser._id));
    }
  }, [currentUser]);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredThreads(threads || []);
      setSearchedUsers([]);
    } else {
      const lower = search.toLowerCase();
      const matches = (threads || []).filter((item) => {
        // Identify the other user in the thread
        const otherUser = item.senderId._id === currentUser._id ? item.receiverId : item.senderId;
        return otherUser.name.toLowerCase().includes(lower);
      });
      setFilteredThreads(matches);
    }
  }, [search, threads]);

  const handleSearchChange = async (text) => {
    setSearch(text);
    if (text.trim() !== '') {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/search?query=${text}`);
        setSearchedUsers(res.data);
      } catch (err) {
        console.error('User search failed:', err.message);
      }
    } else {
      setSearchedUsers([]);
    }
  };

  const handleUserSelect = (user) => {
    router.push({
      pathname: `screens/chat/${user._id}`,
      params: {
        senderId: currentUser._id,
        receiverId: user._id,
      },
    });
  };

  // Render chat thread item
  const renderThreadItem = ({ item }) => {
    const otherUser = item.senderId._id === currentUser._id ? item.receiverId : item.senderId;
    const lastMessage = item.message || 'No message yet';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: `screens/chat/${otherUser._id}`,
            params: {
              senderId: currentUser._id,
              receiverId: otherUser._id,
            },
          })
        }
      >
        <Image
          source={{ uri: otherUser.avatar || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{otherUser.name}</Text>
          <Text style={styles.message} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render searched user item for starting new chat
  const renderSearchItem = ({ item }) => {
    if (item._id === currentUser._id) return null;

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleUserSelect(item)}>
        <Image
          source={{ uri: item.avatar || 'https://via.placeholder.com/50' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.message}>Start a conversation</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search users or threads..."
        value={search}
        onChangeText={handleSearchChange}
        style={styles.searchBar}
      />

      <FlatList
        data={search.trim() ? searchedUsers : filteredThreads}
        keyExtractor={(item) => item._id}
        renderItem={search.trim() ? renderSearchItem : renderThreadItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            {loading ? 'Loading...' : 'No conversations found.'}
          </Text>
        }
      />

      {error && (
        <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  message: {
    color: '#777',
    fontSize: 14,
    marginTop: 2,
  },
});
