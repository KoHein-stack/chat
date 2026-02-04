
import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation, useFocusEffect } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
}

export default function ChatScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello ❤️', sender: 'other' },
        { id: '2', text: 'Hi 😊', sender: 'me' },
    ]);

    const listRef = useRef<FlatList>(null);
    const isHandlingBackRef = useRef(false);

    // Handle back navigation - go back to tabs instead of exiting
    const handleBack = useCallback(() => {
        if (isHandlingBackRef.current) return;
        isHandlingBackRef.current = true;
        router.replace('/(tabs)');
        // Reset flag after navigation completes
        setTimeout(() => {
            isHandlingBackRef.current = false;
        }, 500);
    }, [router]);

    // Handle Android back button and swipe gesture
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (!navigation.canGoBack()) {
                    handleBack();
                    return true; // Prevent default back behavior
                }
                return false; // Allow default back behavior
            };

            // Handle Android hardware back button
            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            // Handle navigation back gesture - redirect to tabs if would exit app
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {
                // Prevent infinite loops
                if (isHandlingBackRef.current) {
                    return; // Allow navigation to proceed
                }

                // Only intercept if we can't go back (would exit app)
                if (!navigation.canGoBack()) {
                    e.preventDefault();
                    isHandlingBackRef.current = true;

                    // Use requestAnimationFrame to defer navigation outside event handler
                    requestAnimationFrame(() => {
                        router.replace('/(tabs)');
                        // Reset flag after a delay
                        setTimeout(() => {
                            isHandlingBackRef.current = false;
                        }, 500);
                    });
                }
            });

            return () => {
                backHandler.remove();
                unsubscribe();
                isHandlingBackRef.current = false;
            };
        }, [navigation, router, handleBack])
    );

    const sendMessage = () => {
        if (!message.trim()) return;

        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), text: message, sender: 'me' },
        ]);
        setMessage('');

        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={styles.backButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Icon name="arrow-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>❤️ Chat</Text>
                <View style={styles.backButtonPlaceholder} />
            </View>

            {/* ✅ KeyboardAvoidingView wraps chat area */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Messages */}
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messages}
                    style={{ flex: 1 }}                 // ✅ IMPORTANT
                    keyboardShouldPersistTaps="handled" // ✅ IMPORTANT
                    showsVerticalScrollIndicator={false}   // 👈 HIDE SCROLL BAR
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.bubble,
                                item.sender === 'me' ? styles.myBubble : styles.otherBubble,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.text,
                                    item.sender === 'me' && { color: 'white' },
                                ]}
                            >
                                {item.text}
                            </Text>
                        </View>
                    )}
                />

                {/* Input */}
                <View style={styles.inputRow}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Message"
                        style={styles.input}
                        multiline
                        blurOnSubmit={false}   // ✅ prevent keyboard collapse
                        onSubmitEditing={sendMessage} // optional
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
                        <Icon name="send" size={22} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#F2F2F7',
        borderBottomWidth: 1,
        borderColor: '#F2F2F7',
    },
    backButton: {
        padding: 4,
    },
    backButtonPlaceholder: {
        width: 32, // Same width as back button to center the title
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    messages: {
        padding: 16,
    },
    bubble: {
        padding: 12,
        borderRadius: 16,
        marginBottom: 10,
        maxWidth: '75%',
    },
    myBubble: {
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end',
    },
    otherBubble: {
        backgroundColor: 'white',
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 16,
        color: '#000',
    },
    inputRow: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderColor: '#e5e5ea',
    },
    input: {
        flex: 1,
        backgroundColor: '#f2f2f7',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 8,
        fontSize: 16,
    },
    sendBtn: {
        backgroundColor: '#007AFF',
        marginLeft: 8,
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
