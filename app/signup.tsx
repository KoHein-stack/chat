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
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

const SignUpScreen = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {

    // Check username
    const nameError = !name || name.length < 5
    if (nameError) {
      setNameError('Name must be >= 5 characters')
    }

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
    // Check confirm password
    const confirmPasswordError = confirmPassword !== password
    if (confirmPasswordError) {
      setConfirmPasswordError('Passwords do not match')
    }


    // Break out of the fucntion if there were any issues
    if (nameError ||
      emailError ||
      passwordError ||
      confirmPasswordError) {
      return
    }
    setLoading(true);

    // Simulate API call
    setTimeout(async () => {
      setLoading(false);

      try {
        // Save user data
        const userData = {
          name,
          email,
          createdAt: new Date().toISOString(),
        };

        await signIn({ email, user: userData, token: 'dummy_token' });

        Alert.alert(
          'Success',
          'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to main app (tabs)
                router.replace('/(tabs)');
              }
            }
          ]
        );
      } catch {
        Alert.alert('Error', 'Failed to create account. Please try again.');
      }
    }, 2000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={[styles.backButtonText, { color: isDarkMode ? '#007AFF' : '#007AFF' }]}>←</Text>
              </TouchableOpacity>
              <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#333' }]}>Create Account</Text>
              <Text style={[styles.subtitle, { color: isDarkMode ? '#aaaaaa' : '#666' }]}>Join our community today</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: isDarkMode ? '#ffffff' : '#333' }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9',
                    borderColor: isDarkMode ? '#333' : '#ddd',
                    color: isDarkMode ? '#ffffff' : '#000',
                  }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={isDarkMode ? '#666' : '#999'}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
                {nameError && <Text style={{
                  color: '#ff5555',
                  marginVertical: 6,
                  paddingLeft: 16
                }}>{nameError}</Text>}
              </View>

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
                  placeholder="Create a password"
                  placeholderTextColor={isDarkMode ? '#666' : '#999'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
                <Text style={[styles.passwordHint, { color: isDarkMode ? '#aaaaaa' : '#666' }]}>
                  Must be at least 6 characters
                </Text>
                {passwordError && <Text style={{
                  color: '#ff5555',
                  marginVertical: 6,
                  paddingLeft: 16
                }}>{passwordError}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: isDarkMode ? '#ffffff' : '#333' }]}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9',
                    borderColor: isDarkMode ? '#333' : '#ddd',
                    color: isDarkMode ? '#ffffff' : '#000',
                  }]}
                  placeholder="Confirm your password"
                  placeholderTextColor={isDarkMode ? '#666' : '#999'}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {confirmPasswordError && <Text style={{
                  color: '#ff5555',
                  marginVertical: 6,
                  paddingLeft: 16
                }}>{confirmPasswordError}</Text>}
              </View>

              <TouchableOpacity
                style={[styles.signupButton, loading && styles.disabledButton]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.signupButtonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <View style={styles.termsContainer}>
                <Text style={[styles.termsText, { color: isDarkMode ? '#aaaaaa' : '#666' }]}>
                  By creating an account, you agree to our{' '}
                  <Text style={styles.link}>Terms of Service</Text> and{' '}
                  <Text style={styles.link}>Privacy Policy</Text>
                </Text>
              </View>

              <View style={styles.loginContainer}>
                <Text style={[styles.loginText, { color: isDarkMode ? '#aaaaaa' : '#666' }]}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
  },
  header: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 24,
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
    paddingBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
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
  passwordHint: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  signupButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },
  link: {
    color: '#007AFF',
    fontWeight: '500',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUpScreen;