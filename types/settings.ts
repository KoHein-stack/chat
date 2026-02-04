/**
 * Main app settings type
 */
export type SettingsType = {
  darkMode: boolean;
  notifications: boolean;
  biometricLogin: boolean;
  autoSave: boolean;
  dataSaver: boolean;
  locationServices: boolean;
  soundEffects: boolean;
  vibration: boolean;
  language?: string; // Optional: for future internationalization
  fontSize?: 'small' | 'medium' | 'large'; // Optional: for accessibility
  theme?: 'system' | 'light' | 'dark'; // Optional: for more theme control
};

/**
 * User profile data
 */
export type UserData = {
  id?: string; // Optional: for database integration
  name: string;
  email: string;
  phoneNumber?: string; // Optional: for future features
  avatarUrl?: string; // Optional: for profile pictures
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  bio?: string; // Optional: user biography
};

/**
 * Storage usage information
 */
export type StorageInfo = {
  used: number; // in megabytes
  total: number; // in megabytes
  breakdown?: { // Optional: detailed breakdown
    cache: number;
    userData: number;
    media: number;
    other: number;
  };
};

/**
 * Individual setting row configuration
 */
export type SettingRow = {
  key: keyof SettingsType;
  label: string;
  description?: string; // Optional: additional help text
  icon?: string; // Optional: icon name for UI
  requiresPermission?: boolean; // Optional: if setting requires device permission
  platform?: 'ios' | 'android' | 'both'; // Optional: platform-specific settings
};

/**
 * Modal state for editing
 */
export type EditModalState = {
  visible: boolean;
  field: 'name' | 'email' | 'phoneNumber' | 'bio';
  value: string;
  label: string;
};

/**
 * Notification settings
 */
export type NotificationSettings = {
  pushEnabled: boolean;
  emailEnabled: boolean;
  marketingEnabled: boolean;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  categories?: {
    messages: boolean;
    updates: boolean;
    reminders: boolean;
    promotions: boolean;
  };
};

/**
 * Privacy settings
 */
export type PrivacySettings = {
  profileVisibility: 'public' | 'friends' | 'private';
  activityStatus: boolean;
  readReceipts: boolean;
  lastSeen: boolean;
  dataSharing: boolean;
  analytics: boolean;
};

/**
 * Account security settings
 */
export type SecuritySettings = {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  trustedDevices: string[];
  sessionTimeout: number; // in minutes
  passwordLastChanged?: string; // ISO date string
};

/**
 * App preferences
 */
export type AppPreferences = {
  autoPlayMedia: boolean;
  downloadQuality: 'low' | 'medium' | 'high' | 'auto';
  syncOverWifiOnly: boolean;
  backgroundRefresh: boolean;
  reduceAnimations: boolean;
  hapticFeedback: boolean;
};

/**
 * Combined app configuration type
 */
export type AppConfig = {
  settings: SettingsType;
  user: UserData;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  security: SecuritySettings;
  preferences: AppPreferences;
  storage: StorageInfo;
  lastSynced?: string; // ISO date string
  version: string;
};

/**
 * API response types
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
};

export type SettingsResponse = ApiResponse<SettingsType>;
export type UserResponse = ApiResponse<UserData>;

/**
 * Event types for settings changes
 */
export type SettingChangeEvent = {
  key: keyof SettingsType;
  oldValue: boolean | string;
  newValue: boolean | string;
  timestamp: string;
  source: 'user' | 'system' | 'sync';
};

/**
 * Storage calculation result
 */
export type StorageCalculation = {
  totalBytes: number;
  totalMB: number;
  items: Array<{
    key: string;
    size: number;
    type: 'string' | 'object' | 'number' | 'boolean';
  }>;
};

/**
 * Theme colors for dynamic styling
 */
export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
};

/**
 * Theme configuration
 */
export type ThemeConfig = {
  name: 'light' | 'dark' | 'custom';
  colors: ThemeColors;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
};

/**
 * Export all types
 */
export type {
  SettingsType as AppSettings,
  UserData as ProfileData,
  StorageInfo as StorageUsage,
  SettingRow as SettingItem,
};

/**
 * Helper function to create default settings
 */
export function createDefaultSettings(): SettingsType {
  return {
    darkMode: false,
    notifications: true,
    biometricLogin: false,
    autoSave: true,
    dataSaver: false,
    locationServices: true,
    soundEffects: true,
    vibration: true,
    language: 'en',
    fontSize: 'medium',
    theme: 'system',
  };
}

/**
 * Helper function to create default user data
 */
export function createDefaultUserData(): UserData {
  return {
    name: 'User Name',
    email: 'user@example.com',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Helper function to validate settings
 */
export function validateSettings(settings: Partial<SettingsType>): boolean {
  const requiredKeys: Array<keyof SettingsType> = [
    'darkMode',
    'notifications',
    'biometricLogin',
    'autoSave',
    'dataSaver',
    'locationServices',
    'soundEffects',
    'vibration',
  ];

  return requiredKeys.every(key => settings[key] !== undefined);
}

/**
 * Type guard for SettingsType
 */
export function isSettingsType(obj: any): obj is SettingsType {
  return (
    obj &&
    typeof obj.darkMode === 'boolean' &&
    typeof obj.notifications === 'boolean' &&
    typeof obj.biometricLogin === 'boolean' &&
    typeof obj.autoSave === 'boolean' &&
    typeof obj.dataSaver === 'boolean' &&
    typeof obj.locationServices === 'boolean' &&
    typeof obj.soundEffects === 'boolean' &&
    typeof obj.vibration === 'boolean'
  );
}

/**
 * Type guard for UserData
 */
export function isUserData(obj: any): obj is UserData {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    (obj.createdAt === undefined || typeof obj.createdAt === 'string')
  );
}