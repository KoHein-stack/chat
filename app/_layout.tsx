// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ThemeProvider as NavThemeProvider, Theme } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect, useState } from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import 'react-native-reanimated';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { ThemeProvider, useTheme } from './context/ThemeContext';

// /* -------- THEMES -------- */
// const CustomDarkTheme: Theme = {
//   dark: true,
//   colors: {
//     primary: '#007AFF',
//     background: '#121212',
//     card: '#1e1e1e',
//     text: '#ffffff',
//     border: '#333333',
//     notification: '#007AFF',
//   },
//   fonts: {
//     regular: { fontFamily: 'System', fontWeight: '400' },
//     medium: { fontFamily: 'System', fontWeight: '500' },
//     bold: { fontFamily: 'System', fontWeight: '700' },
//     heavy: { fontFamily: 'System', fontWeight: '900' },
//   },
// };

// const CustomLightTheme: Theme = {
//   dark: false,
//   colors: {
//     primary: '#007AFF',
//     background: '#f5f5f5',
//     card: '#ffffff',
//     text: '#333333',
//     border: '#e0e0e0',
//     notification: '#007AFF',
//   },
//   fonts: {
//     regular: { fontFamily: 'System', fontWeight: '400' },
//     medium: { fontFamily: 'System', fontWeight: '500' },
//     bold: { fontFamily: 'System', fontWeight: '700' },
//     heavy: { fontFamily: 'System', fontWeight: '900' },
//   },
// };

// /* -------- ROOT LAYOUT INNER -------- */
// function RootLayoutInner() {
//   const { isDarkMode } = useTheme();
//   const [loading, setLoading] = useState(true);
//   const [initialScreen, setInitialScreen] = useState<string | null>(null);

//   useEffect(() => {
//     const initApp = async () => {
//       try {
//         const hasLaunched = await AsyncStorage.getItem('hasLaunched');
//         const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
//         console.log('Launch status:', hasLaunched, 'Login status:', isLoggedIn);

//         if (!hasLaunched) {
//           setInitialScreen('getting-started');
//           console.log('First launch detected');
//           // await AsyncStorage.setItem('hasLaunched', 'true'); // mark as launched
//           console.log('Set hasLaunched to true');
//         } else if (isLoggedIn === 'true') {
//           setInitialScreen('(tabs)');
//           console.log('User is logged in, navigating to main app');
//         } else {
//           setInitialScreen('login');
//           console.log('User not logged in, navigating to login');
//         }
//       } catch (error) {
//         console.error('Init app error:', error);
//         setInitialScreen('login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initApp();
//   }, []);

//   if (loading || !initialScreen) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? '#121212' : '#fff' }}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   const currentTheme = isDarkMode ? CustomDarkTheme : CustomLightTheme;

//   return (
//     <NavThemeProvider value={currentTheme}>
//       <Stack
//         initialRouteName={initialScreen} // ✅ Set initial screen dynamically
//         screenOptions={{ headerShown: false, contentStyle: { backgroundColor: currentTheme.colors.background } }}
//       >
//         <Stack.Screen name="getting-started" />
//         <Stack.Screen name="login" />
//         <Stack.Screen name="signup" />
//         <Stack.Screen name="(tabs)" />
//       </Stack>
//       <StatusBar style={isDarkMode ? 'light' : 'dark'} />
//     </NavThemeProvider>
//   );
// }

// /* -------- ROOT PROVIDER -------- */
// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <RootLayoutInner />
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }





import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider as NavThemeProvider, Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './context/ThemeContext';

/* -------- THEMES -------- */
const CustomDarkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#007AFF',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#333333',
    notification: '#007AFF',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '900' },
  },
};

const CustomLightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#007AFF',
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    border: '#e0e0e0',
    notification: '#007AFF',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '900' },
  },
};


// function RootLayoutInner() {
//   const { isDarkMode } = useTheme();
//   const [loading, setLoading] = useState(true);
//   const [initialScreen, setInitialScreen] = useState<string | null>(null);

//   useEffect(() => {
//     const initApp = async () => {
//       try {
//         const hasLaunched = await AsyncStorage.getItem('hasLaunched');
//         const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

//         if (!hasLaunched) {
//           setInitialScreen('getting-started');
//           await AsyncStorage.setItem('hasLaunched', 'true'); // mark as launched
//         } else if (isLoggedIn === 'true') {
//           setInitialScreen('(tabs)');
//         } else {
//           setInitialScreen('login');
//         }
//       } catch (error) {
//         console.error(error);
//         setInitialScreen('login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initApp();
//   }, []);

//   if (loading || !initialScreen) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//           backgroundColor: isDarkMode ? '#121212' : '#fff',
//         }}
//       >
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   const currentTheme = isDarkMode ? CustomDarkTheme : CustomLightTheme;

//   // ✅ Render only the initial screen first to avoid duplicates/flicker
//   const stackScreens = () => {
//     switch (initialScreen) {
//       case 'getting-started':
//         console.log('Rendering getting-started stack');
//         return (
//           <>
//             <Stack.Screen name="getting-started" />
//             <Stack.Screen name="login" />
//             <Stack.Screen name="signup" />
//             <Stack.Screen name="(tabs)" />
//           </>
//         );
//       case 'login':
//         console.log('Rendering login stack');
//         return (
//           <>
//             <Stack.Screen name="login" />
//             <Stack.Screen name="signup" />
//             <Stack.Screen name="(tabs)" />
//           </>
//         );
//       case '(tabs)':
//         console.log('Rendering main app stack');
//         return <Stack.Screen name="(tabs)" />;
//       default:
//         return <Stack.Screen name="login" />;
//     }
//   };

//   return (
//     <NavThemeProvider value={currentTheme}>
//       <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: currentTheme.colors.background } }}>
//         {stackScreens()}
//       </Stack>
//       <StatusBar style={isDarkMode ? 'light' : 'dark'} />
//     </NavThemeProvider>
//   );
// }

function RootLayoutInner() {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (!hasLaunched) {
          // DO NOT setItem here. Do it on the Getting Started screen's button.
          setInitialRoute("getting-started");
        } else if (isLoggedIn === 'true') {
          setInitialRoute("(tabs)");
        } else {
          setInitialRoute("login");
        }
      } catch (error) {
        setInitialRoute("login");
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  if (loading || !initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? '#121212' : '#fff' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const currentTheme = isDarkMode ? CustomDarkTheme : CustomLightTheme;

  return (
    <NavThemeProvider value={currentTheme}>
      <Stack 
        // Force the stack to start at the route we calculated
        initialRouteName={initialRoute} 
        screenOptions={{ 
          headerShown: false, 
          contentStyle: { backgroundColor: currentTheme.colors.background } 
        }}
      >
        {/* Define all screens normally. initialRouteName handles the rest */}
        <Stack.Screen name="getting-started" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayoutInner />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}







// import { ThemeProvider as NavThemeProvider, Theme } from '@react-navigation/native';
// import { Stack, useRouter } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';
// import { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { View, ActivityIndicator } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { ThemeProvider, useTheme } from './context/ThemeContext';

// /* ---------------- THEMES ---------------- */

// const CustomDarkTheme: Theme = {
//   dark: true,
//   colors: {
//     primary: '#007AFF',
//     background: '#121212',
//     card: '#1e1e1e',
//     text: '#ffffff',
//     border: '#333333',
//     notification: '#007AFF',
//   },
//   fonts: {
//     regular: { fontFamily: 'System', fontWeight: '400' },
//     medium: { fontFamily: 'System', fontWeight: '500' },
//     bold: { fontFamily: 'System', fontWeight: '700' },
//     heavy: { fontFamily: 'System', fontWeight: '900' },
//   },
// };

// const CustomLightTheme: Theme = {
//   dark: false,
//   colors: {
//     primary: '#007AFF',
//     background: '#f5f5f5',
//     card: '#ffffff',
//     text: '#333333',
//     border: '#e0e0e0',
//     notification: '#007AFF',
//   },
//   fonts: {
//     regular: { fontFamily: 'System', fontWeight: '400' },
//     medium: { fontFamily: 'System', fontWeight: '500' },
//     bold: { fontFamily: 'System', fontWeight: '700' },
//     heavy: { fontFamily: 'System', fontWeight: '900' },
//   },
// };

// /* -------------- INNER LAYOUT -------------- */

// function RootLayoutInner() {
//   const router = useRouter();
//   const { isDarkMode } = useTheme();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initApp = async () => {
//       try {
//         const hasLaunched = await AsyncStorage.getItem('hasLaunched');
//         const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

//         if (hasLaunched === null) {
//           // 🆕 First time user
//           router.replace('/getting-started');
//         } else if (isLoggedIn === 'true') {
//           // ✅ Already logged in
//           router.replace('/(tabs)');
//         } else {
//           // 🔐 Not logged in
//           router.replace('/login');
//         }
//       } catch (error) {
//         console.log('App init error:', error);
//         router.replace('/login');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initApp();
//   }, []);

//   if (loading) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//           backgroundColor: isDarkMode ? '#121212' : '#ffffff',
//         }}
//       >
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   const currentTheme = isDarkMode ? CustomDarkTheme : CustomLightTheme;

//   return (
//     <NavThemeProvider value={currentTheme}>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="getting-started" />
//         <Stack.Screen name="login" />
//         <Stack.Screen name="signup" />
//         <Stack.Screen name="(tabs)" />
//       </Stack>

//       <StatusBar style={isDarkMode ? 'light' : 'dark'} />
//     </NavThemeProvider>
//   );
// }

// /* -------------- ROOT PROVIDERS -------------- */

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <ThemeProvider>
//         <RootLayoutInner />
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }
