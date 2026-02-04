// // app/(tabs)/(chat)/_layout.tsx
import { Stack } from 'expo-router';

export default function ChatStack() {
  return (
    <Stack
     initialRouteName='index'
        screenOptions={{
          headerShown: true,
        }}
    >
      {/* The main chat list */}
      <Stack.Screen name="index" options={{ title: 'My Chats' }} />
      
      {/* The screen that slides in over the list */}
      {/* <Stack.Screen name="[id]" options={{ title: 'Chat Room' }} /> */}
    </Stack>
  );
}