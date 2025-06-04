import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  receiveMessage,
} from "@/redux/slices/chatSlice";
import socket from "@/utils/socket";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';

export default function ChatScreen() {
  const dispatch = useDispatch();
  const flatListRef = useRef();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.patientAuth || state.doctorAuth);

  const [message, setMessage] = useState("");
  const [receiverInfo, setReceiverInfo] = useState(null);
  const [loadingReceiver, setLoadingReceiver] = useState(true);

  const route = useRoute();
  const { senderId, receiverId, name } = route.params;

  const roomId = [senderId, receiverId].sort().join("_");

  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/users/${receiverId}`
        );
        setReceiverInfo(res.data);
      } catch (err) {
        console.error("Failed to load receiver info", err);
      } finally {
        setLoadingReceiver(false);
      }
    };

    fetchReceiver();
  }, [receiverId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const msgData = {
      senderId: user._id,
      receiverId,
      message,
    };

    try {
      // Include token in Authorization header
      const token = await SecureStore.getItemAsync('patientToken') || await SecureStore.getItemAsync('doctorToken');
      console.log('Retrieved Token:', token);
      const res = await axios.post('http://localhost:8000/api/chat/send', msgData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Dispatch the message to Redux store
      dispatch(sendMessage(res.data));

      // Clear the input field
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err.message);
    }
  };

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const token = await SecureStore.getItemAsync('patientToken') || await SecureStore.getItemAsync('doctorToken');
        const res = await axios.get("http://localhost:8000/api/chat", {
          params: { senderId: user._id, receiverId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Dispatch fetched messages to Redux store
        res.data.forEach((msg) => dispatch(receiveMessage(msg)));
      } catch (err) {
        console.error("Failed to fetch messages:", err.message);
      }
    };

    fetchChatMessages();
    socket.connect();
    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (msg) => {
      const senderIdStr = msg.senderId.toString();
      const receiverIdStr = msg.receiverId.toString();

      if (
        (senderIdStr === user._id && receiverIdStr === receiverId) ||
        (senderIdStr === receiverId && receiverIdStr === user._id)
      ) {
        dispatch(receiveMessage(msg));
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [user._id, receiverId]);

  useEffect(() => {
    console.log("Messages state:", messages);
  }, [messages]);

  const startCall = (type) => {
    console.log(`${type} call started`);
    // Add actual call logic
  };

  const renderMessage = ({ item }) => {
    const isSender = item.senderId === user._id;

    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isSender ? styles.bubbleRight : styles.bubbleLeft,
          ]}
        >
          <Text style={styles.messageText}>{item.message}</Text>
        </View>
      </View>
    );
  };

  if (loadingReceiver) {
    return <Text>Loading receiver information...</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.wrapper}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginLeft: 10, marginBottom: 5 }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
  
        {receiverInfo && (
          <View style={styles.header}>
            <Image
              source={{
                uri: receiverInfo.profilePic || "https://via.placeholder.com/100",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>{receiverInfo.name}</Text>
              <Text style={styles.specialist}>{receiverInfo.specialization}</Text>
            </View>
          </View>
        )}
  
        {/* Call Buttons */}
        <View style={styles.callButtonsContainer}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => startCall("audio")}
          >
            <Text style={styles.callButtonText}>Audio Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => startCall("video")}
          >
            <Text style={styles.callButtonText}>Video Call</Text>
          </TouchableOpacity>
        </View>
  
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages.filter(
            (msg) =>
              (msg.senderId === user._id && msg.receiverId === receiverId) ||
              (msg.senderId === receiverId && msg.receiverId === user._id)
          )}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 10, flexGrow: 1 }}
          onLayout={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
  
        {/* Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
  
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  specialist: {
    fontSize: 14,
    color: "#777",
  },
  callButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  callButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  callButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  messageContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 4,
  },
  messageLeft: {
    justifyContent: "flex-start",
  },
  messageRight: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 16,
  },
  bubbleLeft: {
    backgroundColor: "#E5E5E5",
    borderTopLeftRadius: 0,
  },
  bubbleRight: {
    backgroundColor: "#DCF8C5",
    borderTopRightRadius: 0,
  },
  messageText: {
    color: "#000",
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    marginLeft: 8,
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
  },
});
