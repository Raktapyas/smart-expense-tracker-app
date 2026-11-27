import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, useColorScheme, View } from 'react-native';

import { AuthProvider, useAuth } from '@/auth/auth-context';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { useColors } from '@/theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}

function Gate() {
  const { status, retry } = useAuth();
  const colors = useColors();
  const scheme = useColorScheme();

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (status === 'unreachable') {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Card>
            <AppText variant="heading">Cannot reach the server</AppText>
            <AppText variant="muted">
              Check that your phone is on the same Wi-Fi as your Mac, that the Laravel server is running
              (php artisan serve --host=0.0.0.0 --port=8000) and that EXPO_PUBLIC_API_URL in .env.local has your
              Mac&apos;s current address.
            </AppText>
            <Button title="Try again" onPress={retry} />
          </Card>
        </View>
      </Screen>
    );
  }

  const signedIn = status === 'signedIn';

  return (
    <>
      <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}