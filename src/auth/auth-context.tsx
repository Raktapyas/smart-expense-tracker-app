import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { api, ApiError, setAuthToken, setUnauthorizedHandler } from '@/api/client';
import type { AuthResponse, User } from '@/api/types';
import { tokenStorage } from '@/auth/token-storage';

type Status = 'loading' | 'unreachable' | 'signedOut' | 'signedIn';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type AuthContextValue = {
  status: Status;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
  retry: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Shown in the server's list of tokens; deliberately not the phone's personal name.
const DEVICE_NAME = Platform.OS === 'ios' ? 'iPhone app' : Platform.OS === 'android' ? 'Android app' : 'Web app';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<User | null>(null);

  const clearSession = useCallback(async () => {
    setAuthToken(null);
    await tokenStorage.clear();
    setUser(null);
    setStatus('signedOut');
  }, []);

  const restore = useCallback(async () => {
    setStatus('loading');

    const token = await tokenStorage.get();

    if (!token) {
      setStatus('signedOut');

      return;
    }

    setAuthToken(token);

    try {
      const response = await api<{ data: User }>('/user');

      setUser(response.data);
      setStatus('signedIn');
    } catch (error) {
      if (error instanceof ApiError && error.status === 0) {
        setStatus('unreachable');

        return;
      }

      await clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void restore();
  }, [restore]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void clearSession();
    });

    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const startSession = useCallback(async (path: string, body: Record<string, string>) => {
    const response = await api<AuthResponse>(path, {
      method: 'POST',
      body: { ...body, device_name: DEVICE_NAME },
    });

    await tokenStorage.set(response.token);
    setAuthToken(response.token);
    setUser(response.user);
    setStatus('signedIn');
  }, []);

  const signIn = useCallback(
    (email: string, password: string) => startSession('/login', { email, password }),
    [startSession],
  );

  const signUp = useCallback((input: RegisterInput) => startSession('/register', input), [startSession]);

  const signOut = useCallback(async () => {
    try {
      await api('/logout', { method: 'POST' });
    } catch {
      // The token is removed from this phone either way.
    }

    await clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      signIn,
      signUp,
      signOut,
      retry: () => {
        void restore();
      },
    }),
    [status, user, signIn, signUp, signOut, restore],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return context;
}