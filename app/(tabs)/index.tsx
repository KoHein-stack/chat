// import { useTheme } from '@/app/context/ThemeContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { Button, StyleSheet, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function HomeScreen() {
//   const router = useRouter();
//   const [userEmail, setUserEmail] = useState('');
//   const { isDarkMode } = useTheme();

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   const loadUserData = async () => {
//     try {
//       const email = await AsyncStorage.getItem('userEmail');
//       if (email) {
//         setUserEmail(email);
//       }
//     } catch (error) {
//       console.error('Error loading user data:', error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem('userToken');
//       await AsyncStorage.removeItem('userEmail');
//       await AsyncStorage.removeItem('userData');
//       await AsyncStorage.removeItem('hasLaunched'); // Optional: reset launch status
//       router.replace('/login');
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: 20,
//       backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
//     },
//     title: {
//       fontSize: 24,
//       fontWeight: 'bold',
//       marginBottom: 20,
//       color: isDarkMode ? '#ffffff' : '#333333',
//     },
//     subtitle: {
//       fontSize: 16,
//       marginBottom: 20,
//       color: isDarkMode ? '#aaaaaa' : '#666666',
//     },
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.container}>
//         <Text style={styles.title}>
//           Welcome to the App!
//         </Text>
//         {userEmail ? (
//           <Text style={styles.subtitle}>
//             Logged in as: {userEmail}
//           </Text>
//         ) : null}
//         <Button title="Logout" onPress={handleLogout} />
//       </View>
//     </SafeAreaView>
//   );
// }

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface Person {
  name: string;
  isOnline: boolean;
  lastSeen: string;
  avatar?: string;
}

interface LoveInfo {
  girl: Person;
  boy: Person;
  startDate: string;
  daysSince: number;
  photo: string;
}

const LoveCountdownScreen: React.FC = () => {
  const router = useRouter();
  const [loveInfo, setLoveInfo] = useState<LoveInfo>({
    girl: {
      name: 'Emma',
      isOnline: true,
      lastSeen: '2 minutes ago',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    boy: {
      name: 'John',
      isOnline: false,
      lastSeen: '1 hour ago',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    startDate: '2022-06-15',
    daysSince: 1232,
    photo: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  });

  const [userEmail] = useState<string>('user@example.com');
  const [heartScale] = useState(new Animated.Value(1));

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartScale, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('hasLaunched');
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Toggle online status function
  const handleToggleOnline = (person: 'girl' | 'boy'): void => {
    setLoveInfo(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        isOnline: !prev[person].isOnline
      }
    }));
  };

  // Online Status Indicator Component
  const OnlineStatusIndicator: React.FC<{
    isOnline: boolean;
    person: Person;
    onPress?: () => void;
  }> = ({ isOnline, person, onPress }) => (
    <TouchableOpacity
      style={styles.onlineStatusContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {person.avatar ? (
          <Image source={{ uri: person.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>
              {person.name.charAt(0)}
            </Text>
          </View>
        )}

        {/* Online status dot */}
        <View style={[
          styles.onlineDot,
          {
            backgroundColor: isOnline ? '#4CAF50' : '#9E9E9E',
            borderColor: isOnline ? '#388E3C' : '#757575'
          }
        ]} />
      </View>

      <View style={styles.statusTextContainer}>
        <Text style={styles.statusName}>{person.name}</Text>
        <Text style={[
          styles.statusText,
          { color: isOnline ? '#4CAF50' : '#757575' }
        ]}>
          {isOnline ? 'Online' : `${person.lastSeen}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Simple heart icon component
  const HeartIcon: React.FC<{ size?: number; color?: string; style?: any }> = ({
    size = 24,
    color = '#fff',
    style = {}
  }) => (
    <Text style={[{ fontSize: size, color }, style]}>❤️</Text>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <OnlineStatusIndicator
              isOnline={loveInfo.girl.isOnline}
              person={loveInfo.girl}
              onPress={() => handleToggleOnline('girl')}
            />
          </View>

          <View style={styles.headerCenter}>
            <View style={styles.loveTitleContainer}>
              <HeartIcon size={20} style={styles.heartIcon} />
              <Text style={styles.headerTitle}>Love Story</Text>
            </View>
            {userEmail ? (
              <Text style={styles.userEmail}>❤️ {userEmail}</Text>
            ) : null}
          </View>

          <View style={styles.headerRight}>
            <OnlineStatusIndicator
              isOnline={loveInfo.boy.isOnline}
              person={loveInfo.boy}
              onPress={() => handleToggleOnline('boy')}
            />
          </View>
        </View>

        {/* Connection Status Bar */}
        <View style={styles.connectionBar}>
          <View style={styles.connectionLine}>
            <View style={[
              styles.connectionDot,
              { backgroundColor: loveInfo.girl.isOnline ? '#4CAF50' : '#9E9E9E' }
            ]} />
            <View style={[
              styles.connectionLineFill,
              {
                backgroundColor: loveInfo.girl.isOnline && loveInfo.boy.isOnline ?
                  'rgba(76, 175, 80, 0.3)' : 'rgba(158, 158, 158, 0.3)'
              }
            ]} />
            <View style={[
              styles.connectionDot,
              { backgroundColor: loveInfo.boy.isOnline ? '#4CAF50' : '#9E9E9E' }
            ]} />
          </View>
          <Text style={styles.connectionText}>
            {loveInfo.girl.isOnline && loveInfo.boy.isOnline
              ? 'Both Online - Chat Now!'
              : loveInfo.girl.isOnline || loveInfo.boy.isOnline
                ? 'One Online'
                : 'Both Offline'
            }
          </Text>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Love Countdown Card */}
          <View style={styles.countdownCard}>
            <Animated.View style={[styles.heartContainer, { transform: [{ scale: heartScale }] }]}>
              <HeartIcon size={60} color="#FF4081" />
            </Animated.View>

            <Text style={styles.countdownNumber}>{loveInfo.daysSince}</Text>
            <Text style={styles.countdownText}>days of love</Text>

            <View style={styles.namesContainer}>
              <View style={styles.nameWithStatus}>
                <Text style={styles.name}>{loveInfo.girl.name}</Text>
                <View style={[
                  styles.smallOnlineDot,
                  { backgroundColor: loveInfo.girl.isOnline ? '#4CAF50' : '#9E9E9E' }
                ]} />
              </View>

              <Text style={styles.namesHeart}>❤️</Text>

              <View style={styles.nameWithStatus}>
                <View style={[
                  styles.smallOnlineDot,
                  { backgroundColor: loveInfo.boy.isOnline ? '#4CAF50' : '#9E9E9E' }
                ]} />
                <Text style={styles.name}>{loveInfo.boy.name}</Text>
              </View>
            </View>

            <Text style={styles.startDate}>
              Since {formatDate(loveInfo.startDate)}
            </Text>
          </View>

          {/* Love Photo */}
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: loveInfo.photo }}
              style={styles.lovePhoto}
              resizeMode="cover"
            />

            <View style={styles.photoOverlay}>
              <Text style={styles.photoTitle}>Our Journey</Text>
              <Text style={styles.photoSubtitle}>Every moment together is precious</Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statNumber}>{loveInfo.daysSince}</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📸</Text>
              <Text style={styles.statNumber}>247</Text>
              <Text style={styles.statLabel}>Memories</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📍</Text>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Places</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.onlineStatusStat}>
                <View style={[
                  styles.liveDot,
                  {
                    backgroundColor: loveInfo.girl.isOnline || loveInfo.boy.isOnline
                      ? '#4CAF50' : '#9E9E9E'
                  }
                ]} />
                <Text style={styles.statNumber}>
                  {loveInfo.girl.isOnline && loveInfo.boy.isOnline ? 2 :
                    loveInfo.girl.isOnline || loveInfo.boy.isOnline ? 1 : 0}
                </Text>
              </View>
              <Text style={styles.statLabel}>Online Now</Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer with Logout Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout()}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Every day with you is a blessing ❤️
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF6B9D',
  },
  container: {
    flex: 1,
    backgroundColor: '#FF6B9D',
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  loveTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  heartIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  userEmail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
  },

  // Online Status Indicator
  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    backgroundColor: '#FF4081',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusTextContainer: {
    flexDirection: 'column',
  },
  statusName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },

  // Connection Status Bar
  connectionBar: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  connectionLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 5,
  },
  connectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },
  connectionLineFill: {
    flex: 1,
    height: 4,
    marginHorizontal: -6,
    zIndex: 1,
  },
  connectionText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },

  // Content Area
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },

  // Countdown Card
  countdownCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  heartContainer: {
    marginBottom: 10,
  },
  countdownNumber: {
    fontSize: 72,
    fontWeight: '800',
    color: '#FF4081',
  },
  countdownText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
    fontWeight: '500',
  },
  namesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameWithStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  namesHeart: {
    fontSize: 24,
    color: '#FF4081',
    marginHorizontal: 15,
  },
  smallOnlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  startDate: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },

  // Love Photo
  photoContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  lovePhoto: {
    width: '100%',
    height: 300,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  photoTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  photoSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  onlineStatusStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  logoutButton: {
    width: '60%',
    backgroundColor: '#FF4081',
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#FF4081',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default LoveCountdownScreen;