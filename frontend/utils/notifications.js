import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

// Configure notification settings
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions for notifications
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for notifications!');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};

// Schedule a notification
export const scheduleNotification = async (title, body, time) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: { seconds: time },
  });
};