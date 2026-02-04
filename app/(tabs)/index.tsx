import { useTheme } from '@/app/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('hasLaunched'); // Optional: reset launch status
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDarkMode ? '#ffffff' : '#333333',
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 20,
      color: isDarkMode ? '#aaaaaa' : '#666666',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Welcome to the App!
        </Text>
        {userEmail ? (
          <Text style={styles.subtitle}>
            Logged in as: {userEmail}
          </Text>
        ) : null}
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}