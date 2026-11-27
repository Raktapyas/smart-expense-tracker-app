import { Alert } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { ScrollScreen } from '@/components/scroll-screen';
import { AppText, Button, Card } from '@/components/ui';

export default function MoreScreen() {
  const { user, signOut } = useAuth();

  function confirmSignOut() {
    Alert.alert('Sign out', 'Sign out of this device?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void signOut() },
    ]);
  }

  return (
    <ScrollScreen>
      <AppText variant="title">More</AppText>

      <Card>
        <AppText variant="muted">Signed in as</AppText>
        <AppText variant="heading">{user?.name}</AppText>
        <AppText variant="muted">{user?.email}</AppText>
      </Card>

      <Card>
        <AppText variant="muted">Insights, smart rules, recurring transactions and budgets arrive in upcoming steps.</AppText>
      </Card>

      <Button title="Sign out" variant="secondary" onPress={confirmSignOut} />
    </ScrollScreen>
  );
}