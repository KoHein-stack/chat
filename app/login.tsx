import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

const LoginScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {


    // Check email
    const emailError = !email || !email.includes('@')
    if (emailError) {
      setEmailError('Please enter a valid email')
    }

    // Check password
    const passwordError = !password || password.length < 8
    if (passwordError) {
      setPasswordError('Password is too short')
    }

    // Break out of the fucntion if there were any issues
    if (emailError || passwordError) {
      return
    }

    setLoading(true);

    // Simulate API call
    setTimeout(async () => {
      setLoading(false);

      // Demo validation
      if (email.includes('@')) {
        try {
          // Keep any existing profile if present; otherwise create a fallback
          const existingUserData = await AsyncStorage.getItem('userData');
          const existingUser = existingUserData ? JSON.parse(existingUserData) : null;
          await signIn({
            email,
            user: existingUser && existingUser.email ? existingUser : undefined,
            name: existingUser?.name,
            token: 'dummy_token',
          });

          Alert.alert('Success', 'Logged in successfully!');
          router.replace('/(tabs)'); // Navigate to main app
        } catch (error) {
          Alert.alert('Error', 'Failed to save login data');
          console.error(error);
        }
      } else {
        Alert.alert('Error', 'Please enter a valid email');
      }
    }, 1500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#333' }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: isDarkMode ? '#aaaaaa' : '#666' }]}>Sign in to continue</Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: isDarkMode ? '#ffffff' : '#333' }]}>Email Address</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9',
                  borderColor: isDarkMode ? '#333' : '#ddd',
                  color: isDarkMode ? '#ffffff' : '#000',
                }]}
                placeholder="Enter your email"
                placeholderTextColor={isDarkMode ? '#666' : '#999'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {emailError && <Text style={{
                color: '#ff5555',
                marginVertical: 6,
                paddingLeft: 16
              }}>{emailError}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: isDarkMode ? '#ffffff' : '#333' }]}>Password</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9',
                  borderColor: isDarkMode ? '#333' : '#ddd',
                  color: isDarkMode ? '#ffffff' : '#000',
                }]}
                placeholder="Enter your password"
                placeholderTextColor={isDarkMode ? '#666' : '#999'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
              {passwordError && <Text style={{
                color: '#ff5555',
                marginVertical: 6,
                paddingLeft: 16
              }}>{passwordError}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => router.push('/signup' as Href)}
            >
              <Text style={styles.signupButtonText}>Create New Account</Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: isDarkMode ? '#aaaaaa' : '#666' }]}>
              By signing in, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};


// Styles remain the same as previous example
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: 30,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    paddingHorizontal: 30,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#007AFF',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    paddingHorizontal: 15,
    color: '#999',
    fontSize: 14,
  },
  signupButton: {
    borderWidth: 2,
    borderColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    lineHeight: 18,
  },
  link: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default LoginScreen;