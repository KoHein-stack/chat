import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GettingStartedScreen = () => {
    const router = useRouter();
    const { colors } = useTheme();

    const handleGetStarted = async () => {
        try {
            await AsyncStorage.setItem('hasLaunched', 'true');
            router.replace('/login'); // ✅ NO FLICKER
        } catch (error) {
            console.error('Error saving launch state:', error);
            router.replace('/login');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('@/assets/images/icon.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Welcome to Our App!
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text }]}>
                        Discover amazing features and connect with people around the world.
                        Lets get started on this exciting journey!
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipButton} onPress={handleGetStarted}>
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.indicatorContainer}>
                <View style={[styles.indicator, styles.activeIndicator]} />
                <View style={styles.indicator} />
                <View style={styles.indicator} />
            </View>
        </SafeAreaView>
    );
};

export default GettingStartedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        marginBottom: 40,
    },
    image: {
        width: 200,
        height: 200,
    },
    textContainer: {
        marginBottom: 50,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    skipButton: {
        paddingVertical: 10,
    },
    skipText: {
        color: '#888',
        fontSize: 16,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 40,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ddd',
        marginHorizontal: 5,
    },
    activeIndicator: {
        backgroundColor: '#007AFF',
        width: 30,
    },
});
