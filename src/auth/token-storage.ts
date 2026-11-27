import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const KEY = 'auth_token';

// expo-secure-store has no web version, so a browser build falls back to localStorage.
const isWeb = Platform.OS === 'web';

export const tokenStorage = {
  async get(): Promise<string | null> {
    if (isWeb) {
      return typeof localStorage === 'undefined' ? null : localStorage.getItem(KEY);
    }

    return SecureStore.getItemAsync(KEY);
  },

  async set(token: string): Promise<void> {
    if (isWeb) {
      localStorage.setItem(KEY, token);

      return;
    }

    await SecureStore.setItemAsync(KEY, token);
  },

  async clear(): Promise<void> {
    if (isWeb) {
      localStorage.removeItem(KEY);

      return;
    }

    await SecureStore.deleteItemAsync(KEY);
  },
};