import { ScrollScreen } from '@/components/scroll-screen';
import { AppText, Card } from '@/components/ui';

export default function TransactionsScreen() {
  return (
    <ScrollScreen>
      <AppText variant="title">Transactions</AppText>
      <Card>
        <AppText variant="muted">
          The full list with filters, and adding or editing transactions, arrives in the next step.
        </AppText>
      </Card>
    </ScrollScreen>
  );
}