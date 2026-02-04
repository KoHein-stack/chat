// // app/(tabs)/(chat)/_layout.tsx
import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // headerTitle: '❤️ Chat',
          headerShown: false,
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
