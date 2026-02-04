import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
}

const ChatScreen = () => {
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
                            <Text style={styles.messageText}>{item.text}</Text>
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
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    messageContainer: {
        maxWidth: '70%',
        padding: 10,
        borderRadius: 12,
        marginVertical: 4,
    },
    myMessage: {
        backgroundColor: '#0078fe',
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    otherMessage: {
        backgroundColor: '#e5e5ea',
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    messageText: {
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#0078fe',
        borderRadius: 20,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
});
