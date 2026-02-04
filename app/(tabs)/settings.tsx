import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/app/context/ThemeContext';

// Types (keep them local for now)
type SettingsType = {
  darkMode: boolean;
  notifications: boolean;
  biometricLogin: boolean;
  autoSave: boolean;
  dataSaver: boolean;
  locationServices: boolean;
  soundEffects: boolean;
  vibration: boolean;
};

type UserData = {
  name: string;
  email: string;
  createdAt?: string;
};

type StorageInfo = {
  used: number;
  total: number;
};

export default function Settings() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { theme: appTheme, isDarkMode, setTheme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState<SettingsType>({
    darkMode: isDarkMode,
    notifications: false, // Disable by default for Expo Go
    biometricLogin: false,
    autoSave: true,
    dataSaver: false,
    locationServices: true,
    soundEffects: true,
    vibration: true,
  });

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editField, setEditField] = useState<'name' | 'email'>('name');
  const [editValue, setEditValue] = useState<string>('');
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    used: 0,
    total: 50,
  });

  // Settings configuration
  const settingRows = [
    { key: 'darkMode' as const, label: 'Dark Mode' },
    { key: 'notifications' as const, label: 'Push Notifications' },
    { key: 'biometricLogin' as const, label: 'Biometric Login' },
    { key: 'autoSave' as const, label: 'Auto Save' },
    { key: 'dataSaver' as const, label: 'Data Saver Mode' },
    { key: 'locationServices' as const, label: 'Location Services' },
    { key: 'soundEffects' as const, label: 'Sound Effects' },
    { key: 'vibration' as const, label: 'Vibration' },
  ];

  useEffect(() => {
    loadUserData();
    loadSettings();
    calculateStorage();
  }, []);

  // Update settings when isDarkMode changes
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      darkMode: isDarkMode
    }));
  }, [isDarkMode]);

  const loadUserData = async (): Promise<void> => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadSettings = async (): Promise<void> => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings) as SettingsType;
        setSettings(parsedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: SettingsType): Promise<void> => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const calculateStorage = async (): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      const totalSize = stores.reduce((acc, [key, value]) => {
        return acc + (key.length + (value ? value.length : 0));
      }, 0);
      
      const usedMB = (totalSize / (1024 * 1024)).toFixed(2);
      setStorageInfo(prev => ({ ...prev, used: parseFloat(usedMB) }));
    } catch (error) {
      console.error('Error calculating storage:', error);
    }
  };

  const toggleSetting = async (key: keyof SettingsType): Promise<void> => {
    const newSettings = { ...settings, [key]: !settings[key] };
    
    // Special handling for notifications in Expo Go
    if (key === 'notifications' && newSettings.notifications) {
      Alert.alert(
        'Development Mode',
        'Push notifications require a development build, not Expo Go. Learn more: https://expo.dev/go/development-builds'
      );
      newSettings.notifications = false;
    }
    
    // Special handling for dark mode - update global theme
    if (key === 'darkMode') {
      toggleTheme();
      // Dark mode will be updated via the useEffect above
      return;
    }
    
    await saveSettings(newSettings);
  };

  const handleEditProfile = (field: 'name' | 'email', value: string): void => {
    setEditField(field);
    setEditValue(value);
    setModalVisible(true);
  };

  const saveProfileChange = async (): Promise<void> => {
    if (!userData) return;

    try {
      const updatedUserData = { ...userData, [editField]: editValue };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUserData(updatedUserData);
      setModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleClearCache = async (): Promise<void> => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const userToken = await AsyncStorage.getItem('userToken');
              const userData = await AsyncStorage.getItem('userData');
              const hasLaunched = await AsyncStorage.getItem('hasLaunched');
              const appSettings = await AsyncStorage.getItem('appSettings');
              const appTheme = await AsyncStorage.getItem('appTheme');
              
              await AsyncStorage.clear();
              
              if (userToken) await AsyncStorage.setItem('userToken', userToken);
              if (userData) await AsyncStorage.setItem('userData', userData);
              if (hasLaunched) await AsyncStorage.setItem('hasLaunched', hasLaunched);
              if (appSettings) await AsyncStorage.setItem('appSettings', appSettings);
              if (appTheme) await AsyncStorage.setItem('appTheme', appTheme);
              
              await calculateStorage();
              Alert.alert('Success', 'Cache cleared successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async (): Promise<void> => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('email');
              router.replace('/login');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ]
    );
  };

  const checkForUpdates = (): void => {
    Alert.alert(
      'Check for Updates',
      'This feature requires a development build.',
      [
        { text: 'OK' }
      ]
    );
  };

  const openPrivacyPolicy = (): void => {
    Alert.alert('Privacy Policy', 'Our privacy policy can be found at: https://example.com/privacy');
  };

  const openTermsOfService = (): void => {
    Alert.alert('Terms of Service', 'Our terms can be found at: https://example.com/terms');
  };

  const getStoragePercentage = (): number => {
    return (storageInfo.used / storageInfo.total) * 100;
  };

  const getAvatarInitial = (): string => {
    if (userData?.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    scrollContainer: {
      padding: 16,
    },
    section: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
      borderRadius: 12,
      marginBottom: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.1 : 0.05,
      shadowRadius: 4,
      elevation: 2,
    } as ViewStyle,
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDarkMode ? '#ffffff' : '#333333',
      marginBottom: 12,
    } as TextStyle,
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#eee',
    } as ViewStyle,
    settingRowLast: {
      borderBottomWidth: 0,
    } as ViewStyle,
    settingLabel: {
      fontSize: 16,
      color: isDarkMode ? '#e0e0e0' : '#555555',
      flex: 1,
    } as TextStyle,
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    } as ViewStyle,
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: isDarkMode ? '#333' : '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    } as ViewStyle,
    avatarText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
    } as TextStyle,
    profileInfo: {
      flex: 1,
    } as ViewStyle,
    profileName: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#333333',
      marginBottom: 4,
    } as TextStyle,
    profileEmail: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
    } as TextStyle,
    editButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: isDarkMode ? '#333' : '#007AFF',
      borderRadius: 20,
    } as ViewStyle,
    editButtonText: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '600',
    } as TextStyle,
    actionButton: {
      backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      alignItems: 'center',
    } as ViewStyle,
    actionButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#333333',
    } as TextStyle,
    dangerButton: {
      backgroundColor: '#ff3b30',
    } as ViewStyle,
    dangerButtonText: {
      color: '#ffffff',
    } as TextStyle,
    storageContainer: {
      marginTop: 8,
    } as ViewStyle,
    storageInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    } as ViewStyle,
    storageText: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#666',
    } as TextStyle,
    storageBar: {
      height: 8,
      backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
      borderRadius: 4,
      overflow: 'hidden',
    } as ViewStyle,
    storageFill: {
      height: '100%',
      backgroundColor: '#007AFF',
      borderRadius: 4,
      width: `${getStoragePercentage()}%`,
    } as ViewStyle,
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    } as ViewStyle,
    modalContent: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
      borderRadius: 12,
      padding: 24,
      width: '85%',
      maxWidth: 400,
    } as ViewStyle,
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDarkMode ? '#ffffff' : '#333333',
      textAlign: 'center',
    } as TextStyle,
    modalInput: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#333' : '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 20,
      color: isDarkMode ? '#ffffff' : '#333333',
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f9f9f9',
    } as TextStyle,
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    } as ViewStyle,
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 4,
    } as ViewStyle,
    modalCancel: {
      backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
    } as ViewStyle,
    modalSave: {
      backgroundColor: '#007AFF',
    } as ViewStyle,
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
    } as TextStyle,
    modalCancelText: {
      color: isDarkMode ? '#ffffff' : '#333333',
    } as TextStyle,
    modalSaveText: {
      color: '#ffffff',
    } as TextStyle,
    versionText: {
      textAlign: 'center',
      fontSize: 12,
      color: isDarkMode ? '#666' : '#999',
      marginTop: 20,
    } as TextStyle,
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getAvatarInitial()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userData?.name || 'User Name'}
              </Text>
              <Text style={styles.profileEmail}>
                {userData?.email || 'user@example.com'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => handleEditProfile('name', userData?.name || '')}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          {settingRows.map((row, index) => (
            <View 
              key={row.key} 
              style={[
                styles.settingRow,
                index === settingRows.length - 1 && styles.settingRowLast
              ]}
            >
              <Text style={styles.settingLabel}>{row.label}</Text>
              <Switch
                value={settings[row.key]}
                onValueChange={() => toggleSetting(row.key)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={settings[row.key] ? '#007AFF' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <View style={styles.storageContainer}>
            <View style={styles.storageInfo}>
              <Text style={styles.storageText}>
                {storageInfo.used.toFixed(2)} MB of {storageInfo.total} MB used
              </Text>
              <Text style={styles.storageText}>
                {getStoragePercentage().toFixed(1)}%
              </Text>
            </View>
            <View style={styles.storageBar}>
              <View style={styles.storageFill} />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleClearCache}
          >
            <Text style={styles.actionButtonText}>Clear Cache</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={checkForUpdates}
          >
            <Text style={styles.actionButtonText}>Check for Updates</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={openPrivacyPolicy}
          >
            <Text style={styles.actionButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={openTermsOfService}
          >
            <Text style={styles.actionButtonText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleLogout}
          >
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>
          Version 1.0.0
        </Text>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {editField === 'name' ? 'Name' : 'Email'}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter your ${editField}`}
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              autoFocus={true}
              keyboardType={editField === 'email' ? 'email-address' : 'default'}
              autoCapitalize={editField === 'name' ? 'words' : 'none'}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, styles.modalCancelText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSave]}
                onPress={saveProfileChange}
              >
                <Text style={[styles.modalButtonText, styles.modalSaveText]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}