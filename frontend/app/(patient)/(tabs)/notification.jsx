import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "@/redux/slices/notificationSlice";
import axiosInstance from '@/utils/axiosInstance';
import * as Notifications from 'expo-notifications';

const NotificationScreen = () => {
  const dispatch = useDispatch(); 
  const {notifications} = useSelector(
    (state) => state.notifications
  );
  const { user } = useSelector((state) => state.patientAuth);
  const userId = user?._id;
  const [expoPushToken, setExpoPushToken] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(`/api/notifications/${userId}`);
        console.log('Fetched notifications:', response.data.notifications); // Log the fetched notifications
        response.data.notifications.forEach((notification) => {
          dispatch(addNotification(notification));
        });
        console.log('Redux state notifications:', notifications); // Log Redux state notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [dispatch, userId]);

  useEffect(() => { 
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      dispatch(addNotification({
        id: notification.request.identifier,
        title: notification.request.content.title,
        body: notification.request.content.body,
      }));
    });

    return () => subscription.remove();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Notification permission not granted');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync({ projectId: 'a1ee8245-6e10-4164-a315-4d9e616f1bc7' })).data;
      console.log('Push notification token:', token);
    } catch (error) {
      console.error('Error getting push notification token:', error);
    }

    return token;
  };

  const markAsRead = async (notificationId) => {
    try {
      await axiosInstance.patch(`/api/notifications/${notificationId}`);
      // Optionally, update the Redux state to reflect the read status
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await axiosInstance.get(`/api/notifications/${userId}`);
      console.log('Refreshed notifications:', response.data.notifications);
      dispatch({ type: 'notifications/setNotifications', payload: response.data.notifications });
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderNotification = ({ item }) => {
    console.log('Rendering notification:', item); // Log each notification being rendered

    return (
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={() => markAsRead(item._id)}
      >
        <Text style={styles.notificationType}>{item.type ? item.type.toUpperCase() : 'GENERAL'}</Text>
        <Text style={styles.notificationMessage}>{item.message || 'No additional details available'}</Text>
      </TouchableOpacity>
    );
  };

  console.log('Notifications in Redux state:', notifications); // Log notifications array in Redux state

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No notifications yet</Text>
      ) : (
        <FlatList
          data={notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))} // Sort notifications by timestamp, newest first
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={renderNotification}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1f2937",
  },
  noNotifications: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
  },
  notificationItem: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationType: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#555",
  },
});

export default NotificationScreen;
