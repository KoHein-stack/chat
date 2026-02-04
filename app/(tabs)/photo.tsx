import React, { useState } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImageViewing from 'react-native-image-viewing';
import { Ionicons } from '@expo/vector-icons';

export default function Photos() {
  const [images, setImages] = useState<{ uri: string }[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 0,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => ({ uri: asset.uri }));
      setImages(prev => [...newImages, ...prev]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Upload button */}
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
        <Ionicons name="images" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No photos yet 💕</Text>
        </View>
      ) : (
        <FlatList
          data={images}
          numColumns={3}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                setCurrentIndex(index);
                setVisible(true);
              }}
            >
              <Image source={{ uri: item.uri }} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Full-screen viewer */}
      <ImageViewing
        images={images}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  uploadBtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 10,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    margin: 4,
    borderRadius: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});
