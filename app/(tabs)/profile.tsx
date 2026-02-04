import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function Profile() {
  // Mock user data
  const user = {
    name: 'Alex Johnson',
    username: '@alexjohn',
    bio: 'Digital artist 🎨 | Coffee enthusiast ☕ | Always up for deep conversations',
    status: 'Online',
    lastSeen: 'Just now',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: 'Joined March 2023',
    mediaCount: 245,
    commonGroups: 3,
  };

  const handleCall = (type: any) => {
    console.log(`Initiating ${type} call...`);
    // Implement call functionality
  };

  const handleAction = (action : any) => {
    console.log(`${action} action triggered`);
    // Implement action functionality
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Profile Image Section */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageWrapper}>
            <Image
              source="https://images.unsplash.com/photo-1494790108755-2616b786d4d7?w=400&h=400&fit=crop"
              style={styles.profileImage}
              contentFit="cover"
            />
            <View style={[styles.statusIndicator, { backgroundColor: '#4CAF50' }]} />
          </View>
          
          {/* Status Badge */}
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statusText}>{user.status}</Text>
          </View>
        </View>

        {/* User Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.bio}>{user.bio}</Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Feather name="phone" size={16} color="#666" />
              <Text style={styles.metaText}>{user.phone}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={16} color="#666" />
              <Text style={styles.metaText}>{user.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="calendar" size={16} color="#666" />
              <Text style={styles.metaText}>{user.joinDate}</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.mediaCount}</Text>
            <Text style={styles.statLabel}>Media</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.commonGroups}</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Chatting</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.callButton]}
              onPress={() => handleCall('voice')}
            >
              <Feather name="phone" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Voice Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.videoButton]}
              onPress={() => handleCall('video')}
            >
              <Feather name="video" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Video Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* More Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Options</Text>
          
          {[
            { icon: 'star', label: 'Add to Favorites', color: '#FFB800' },
            { icon: 'notifications', label: 'Mute Notifications', color: '#666' },
            { icon: 'block', label: 'Block User', color: '#FF3B30' },
            { icon: 'delete', label: 'Delete Chat', color: '#FF3B30' },
            { icon: 'shield', label: 'Report User', color: '#666' },
          ].map((option, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.optionItem}
              onPress={() => handleAction(option.label)}
            >
              <View style={[styles.optionIcon, { backgroundColor: `${option.color}15` }]}>
                <MaterialIcons 
                  name='star'
                  size={22} 
                  color={option.color} 
                />
              </View>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Shared Media Preview */}
        <View style={styles.mediaContainer}>
          <View style={styles.mediaHeader}>
            <Text style={styles.sectionTitle}>Shared Media</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.mediaItem}>
                <Image
                  source={`https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=200&h=200&fit=crop`}
                  style={styles.mediaImage}
                  contentFit="cover"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  menuButton: {
    padding: 5,
  },
  profileImageContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#fff',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF5015',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  bio: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  metaInfo: {
    width: '100%',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  callButton: {
    backgroundColor: '#007AFF',
  },
  videoButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  mediaContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  mediaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  mediaScroll: {
    flexDirection: 'row',
  },
  mediaItem: {
    marginRight: 12,
  },
  mediaImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});