import { ScrollScreen } from '@/components/scroll-screen';
import { AppText, Card } from '@/components/ui';

export default function AccountsScreen() {
  return (
    <ScrollScreen>
      <AppText variant="title">Accounts</AppText>
      <Card>
        <AppText variant="muted">Managing accounts and budgets arrives in an upcoming step.</AppText>
      </Card>
    </ScrollScreen>
  );
}