import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

// Install if not already: npx expo install @expo/vector-icons

// Simple React Native icon component
const TabIcon = ({ name, color }: { name: string; color: string }) => {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (name) {
    case 'house.fill':
      iconName = 'home';
      break;
    case 'message.fill':
      iconName = 'chatbubble';
      break;
    case 'person.fill':
      iconName = 'person';
      break;
    case 'gearshape.fill':
      iconName = 'settings';
      break;
    default:
      iconName = 'help';
  }

  return <Ionicons name={iconName} size={24} color={color} />;
};

// Or if you want to use emojis instead of icons
const EmojiTabIcon = ({ name, color }: { name: string; color: string }) => {
  let emoji = '❓';

  switch (name) {
    case 'house.fill':
      emoji = '🏠';
      break;
    case 'message.fill':
      emoji = '💬';
      break;
    case 'person.fill':
      emoji = '👤';
      break;
    case 'gearshape.fill':
      emoji = '⚙️';
      break; // <- missing in your code
    case 'photo.fill':
      emoji = '🖼️'; // photo emoji
      break;
    default:
      emoji = '❓'; // optional: default emoji if no match
  }

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24 }}>{emoji}</Text>
    </View>
  );
};

export default function TabLayout() {
  // For now, use a simple theme - remove useTheme if causing issues
  const isDarkMode = false; // Temporary

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#ffffff',
          borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="photo" // route name
        options={{
          title: 'Photos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="image" size={size} color={color} /> // make sure the icon exists in Ionicons
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}