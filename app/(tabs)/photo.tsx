import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageViewing from 'react-native-image-viewing';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function Photos() {
  const { isDarkMode } = useTheme();
  const { width } = useWindowDimensions();

  type GalleryImage = { id: string; uri: string; createdAt: number };
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const storageKey = 'galleryImages';

  const tileSize = useMemo(() => {
    const padding = 16;
    const gap = 10;
    const columns = 3;
    return Math.floor((width - padding * 2 - gap * (columns - 1)) / columns);
  }, [width]);

  const loadImages = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as GalleryImage[];
      if (Array.isArray(parsed)) setImages(parsed);
    } catch {
      // ignore
    }
  }, []);

  const persistImages = useCallback(async (next: GalleryImage[]) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const pickImages = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'Please allow photo library access to add pictures to your gallery.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 0,
    });

    if (!result.canceled) {
      const now = Date.now();
      const newImages: GalleryImage[] = result.assets.map((asset, idx) => ({
        id: `${now}-${idx}-${asset.uri}`,
        uri: asset.uri,
        createdAt: now,
      }));

      setImages(prev => {
        const next = [...newImages, ...prev];
        persistImages(next);
        return next;
      });
    }
  }, [persistImages]);

  const openViewer = useCallback((index: number) => {
    setCurrentIndex(index);
    setVisible(true);
  }, []);

  const closeViewer = useCallback(() => setVisible(false), []);

  const deleteCurrent = useCallback(() => {
    const img = images[currentIndex];
    if (!img) return;

    Alert.alert('Delete photo?', 'This will remove it from your gallery.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setImages(prev => {
            const next = prev.filter(x => x.id !== img.id);
            persistImages(next);
            return next;
          });
          setVisible(false);
        },
      },
    ]);
  }, [currentIndex, images, persistImages]);

  const clearAll = useCallback(() => {
    if (images.length === 0) return;
    Alert.alert('Clear gallery?', 'Remove all photos from your gallery.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setImages([]);
          persistImages([]);
        },
      },
    ]);
  }, [images.length, persistImages]);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
            borderBottomColor: isDarkMode ? '#333' : '#f0f0f0',
          },
        ]}
      >
        <View>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#111' }]}>Gallery</Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#aaa' : '#666' }]}>
            {images.length === 0
              ? 'Add your first photo'
              : `${images.length} photo${images.length === 1 ? '' : 's'}`}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={clearAll}
            disabled={images.length === 0}
            style={[
              styles.iconBtn,
              {
                opacity: images.length === 0 ? 0.4 : 1,
                backgroundColor: isDarkMode ? '#2a2a2a' : '#f4f4f6',
              },
            ]}
          >
            <Ionicons name="trash-outline" size={18} color={isDarkMode ? '#fff' : '#111'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImages} style={styles.addBtn}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: isDarkMode ? '#1e1e1e' : '#f4f4f6' }]}>
            <Ionicons name="images-outline" size={28} color={isDarkMode ? '#fff' : '#111'} />
          </View>
          <Text style={[styles.emptyTitle, { color: isDarkMode ? '#fff' : '#111' }]}>No photos yet</Text>
          <Text style={[styles.emptyText, { color: isDarkMode ? '#aaa' : '#666' }]}>
            Tap “Add” to pick photos from your library.
          </Text>
          <TouchableOpacity style={styles.primaryCta} onPress={pickImages}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.primaryCtaText}>Add photos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={images}
          numColumns={3}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.column}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => openViewer(index)}
              style={[
                styles.card,
                {
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                  shadowOpacity: Platform.OS === 'android' ? 0.15 : 0.08,
                },
              ]}
            >
              <Image source={{ uri: item.uri }} style={styles.image} />
              <View style={styles.cardOverlay} />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Full-screen viewer */}
      <ImageViewing
        images={images.map(i => ({ uri: i.uri }))}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={closeViewer}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        HeaderComponent={() => (
          <View style={styles.viewerHeader}>
            <TouchableOpacity onPress={closeViewer} style={styles.viewerHeaderBtn}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={styles.viewerHeaderRight}>
              <TouchableOpacity onPress={deleteCurrent} style={styles.viewerHeaderBtn}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Floating quick add */}
      <TouchableOpacity style={styles.fab} onPress={pickImages} activeOpacity={0.9}>
        <Ionicons name="images" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 120,
  },
  column: {
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
    fontWeight: '500',
  },
  primaryCta: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryCtaText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },

  viewerHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'android' ? 24 : 48,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  viewerHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewerHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
