import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ApiError } from '@/api/client';
import { useAuth } from '@/auth/auth-context';
import { AppText, Brand, Button, Card, Field, Screen } from '@/components/ui';
import { useColors } from '@/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);

    try {
      await signIn(email.trim(), password);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : new ApiError(0, 'Something went wrong. Please try again.'));
      setBusy(false);
    }
  }

  const emailError = error?.fieldError('email');
  const passwordError = error?.fieldError('password');

  return (
    <Screen scroll>
      <View style={{ flex: 1, justifyContent: 'center', gap: 24 }}>
        <Brand />
        <Card>
          <AppText variant="heading">Welcome back</AppText>
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            textContentType="username"
            error={emailError}
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
            error={passwordError}
          />
          {error && !emailError && !passwordError ? <AppText variant="error">{error.message}</AppText> : null}
          <Button title="Sign in" onPress={submit} loading={busy} disabled={!email || !password} />
        </Card>
        <Link href="/register" style={{ color: colors.accent, textAlign: 'center', fontSize: 15 }}>
          New here? Create an account
        </Link>
      </View>
    </Screen>
  );
}