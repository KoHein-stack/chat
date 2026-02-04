import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
}

const ChatScreen = () => {
    const { isDarkMode } = useTheme();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello!', sender: 'other' },
        { id: '2', text: 'Hi there!', sender: 'me' },
        { id: '3', text: 'How are you?', sender: 'other' },
    ]);

    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'me',
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
    };

 
const styles = StyleSheet.create({
    messageContainer: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 12,
        marginVertical: 4,
    },
    myMessage: {
        backgroundColor: isDarkMode ? '#0A84FF' : '#0078fe', // Slightly different blue for dark mode
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    otherMessage: {
        backgroundColor: isDarkMode ? '#2C2C2E' : '#f0f0f0', // Dark mode: dark gray, Light mode: light gray
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    myMessageText: {
        color: '#FFFFFF', // Always white text on blue background
    },
    otherMessageText: {
        color: isDarkMode ? '#FFFFFF' : '#000000', // White in dark mode, black in light mode
    },
    messageTime: {
        fontSize: 11,
        color: isDarkMode ? '#8E8E93' : '#666666',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: isDarkMode ? '#1C1C1E' : '#E5E5EA',
        backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    },
       input: {
        flex: 1,
        borderWidth: 1,
        borderColor: isDarkMode ? '#3A3A3C' : '#C7C7CC',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        color: isDarkMode ? '#FFFFFF' : '#000000',
        backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
    },
    sendButton: {
        backgroundColor: isDarkMode ? '#0A84FF' : '#0078fe',
        borderRadius: 20,
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: isDarkMode ? '#3A3A3C' : '#C7C7CC',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <FlatList
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.messageContainer,
                                item.sender === 'me' ? styles.myMessage : styles.otherMessage,
                            ]}
                        >
                            <Text style={styles.myMessageText}>{item.text}</Text>
                        </View>
                    )}
                    contentContainerStyle={{ padding: 12 }}
                    inverted
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message"
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                        <Text style={{ color:  isDarkMode ? '#ffffff' : '#333333', fontWeight: 'bold' }}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;



// app/(tabs)/(chat)/_layout.tsx



// import { Link, useRouter } from 'expo-router';
// import { View, Text, Pressable } from 'react-native';

// export default function ChatList() {
//   const router = useRouter();

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Chat List Screen</Text>
      
//       {/* Method 1: Using Link */}
//       {/* <Link href="/(tabs)/(chat)/room123" asChild>
//         <Pressable><Text>Go to Chat with John</Text></Pressable>
//       </Link> */}

//       {/* Method 2: Using the router hook */}
//       <Pressable onPress={() => alert("hello chat")}>
//         <Text>Go to Chat with Sarah</Text>
//       </Pressable>
//     </View>
//   );
// }