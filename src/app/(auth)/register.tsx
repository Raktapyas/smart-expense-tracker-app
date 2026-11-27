import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ApiError } from '@/api/client';
import { useAuth } from '@/auth/auth-context';
import { AppText, Brand, Button, Card, Field, Screen } from '@/components/ui';
import { useColors } from '@/theme';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const colors = useColors();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);

    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: confirmation,
      });
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : new ApiError(0, 'Something went wrong. Please try again.'));
      setBusy(false);
    }
  }

  const fieldErrors = ['name', 'email', 'password', 'device_name'].some((field) => error?.fieldError(field));

  return (
    <Screen scroll>
      <View style={{ flex: 1, justifyContent: 'center', gap: 24 }}>
        <Brand />
        <Card>
          <AppText variant="heading">Create your account</AppText>
          <Field label="Name" value={name} onChangeText={setName} autoComplete="name" error={error?.fieldError('name')} />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            textContentType="username"
            error={error?.fieldError('email')}
          />
          <Field
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            error={error?.fieldError('password')}
          />
          <Field
            label="Confirm password"
            value={confirmation}
            onChangeText={setConfirmation}
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
          />
          {error && !fieldErrors ? <AppText variant="error">{error.message}</AppText> : null}
          <Button
            title="Create account"
            onPress={submit}
            loading={busy}
            disabled={!name || !email || !password || !confirmation}
          />
        </Card>
        <Link href="/login" style={{ color: colors.accent, textAlign: 'center', fontSize: 15 }}>
          Already have an account? Sign in
        </Link>
      </View>
    </Screen>
  );
}