// app/screens/chat/[id].jsx
import { useLocalSearchParams } from 'expo-router';
import ChatScreen from '@/app/screens/chat/ChatScreen';
import { useSelector } from 'react-redux';
import { Text, View } from 'react-native';

export default function ChatPage() {
  const { id } = useLocalSearchParams(); // "id" is actually the receiverId

  // Determine user from patientAuth or doctorAuth based on your app's logic
  const { user } = useSelector((state) => state.patientAuth || state.doctorAuth);

  if (!user) {
    return <Text>Error: User not authenticated</Text>;
  }

  return (
    <ChatScreen
      senderId={user?._id}
      receiverId={id}
    />
  );
}
