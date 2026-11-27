import { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';

import { api, ApiError } from '@/api/client';
import { useAuth } from '@/auth/auth-context';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { formatMoney } from '@/lib/money';
import { useColors } from '@/theme';

type Dashboard = {
  month_label: string;
  total_balance: string;
  income: string;
  expense: string;
  saved: string;
};

// Temporary home screen: proves sign-in, the stored token and the API work together.
// The real dashboard replaces it in the next step.
export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const colors = useColors();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);

    try {
      const response = await api<{ data: Dashboard }>('/dashboard');

      setDashboard(response.data);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : 'Something went wrong.');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  function confirmSignOut() {
    Alert.alert('Sign out', 'Sign out of this device?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void signOut() },
    ]);
  }

  return (
    <Screen scroll>
      <View style={{ gap: 4 }}>
        <AppText variant="muted">Signed in as {user?.email}</AppText>
        <AppText variant="title">Hello, {user?.name}</AppText>
      </View>

      {error ? (
        <Card>
          <AppText variant="error">{error}</AppText>
          <Button title="Try again" variant="secondary" onPress={() => void load()} />
        </Card>
      ) : dashboard ? (
        <Card>
          <AppText variant="muted">Total balance</AppText>
          <AppText variant="title" style={{ fontVariant: ['tabular-nums'] }}>
            {formatMoney(dashboard.total_balance)}
          </AppText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <AppText variant="small">Income · {dashboard.month_label}</AppText>
              <AppText style={{ color: colors.income, fontVariant: ['tabular-nums'] }}>
                {formatMoney(dashboard.income)}
              </AppText>
            </View>
            <View>
              <AppText variant="small">Spent</AppText>
              <AppText style={{ color: colors.expense, fontVariant: ['tabular-nums'] }}>
                {formatMoney(dashboard.expense)}
              </AppText>
            </View>
          </View>
        </Card>
      ) : (
        <AppText variant="muted">Loading your dashboard…</AppText>
      )}

      <Button title="Sign out" variant="secondary" onPress={confirmSignOut} />
    </Screen>
  );
}