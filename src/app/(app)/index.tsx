import { ActivityIndicator, View } from 'react-native';

import { ApiError } from '@/api/client';
import { useAuth } from '@/auth/auth-context';
import { ScrollScreen } from '@/components/scroll-screen';
import { AppText, Button, Card } from '@/components/ui';
import {
  AccountsCard,
  BalanceCard,
  BudgetsCard,
  CategoryBreakdownCard,
  InsightsCard,
  RecentCard,
  TrendCard,
} from '@/features/dashboard/widgets';
import { useDashboard } from '@/features/dashboard/use-dashboard';
import { useColors } from '@/theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const colors = useColors();
  const { data, error, isPending, isRefetching, refetch } = useDashboard();

  const firstName = user?.name.split(' ')[0] ?? '';
  const message = error instanceof ApiError ? error.message : error ? 'Something went wrong.' : null;

  return (
    <ScrollScreen refreshing={isRefetching} onRefresh={() => void refetch()}>
      <View style={{ gap: 2 }}>
        <AppText variant="muted">{data?.month_label ?? ' '}</AppText>
        <AppText variant="title">Hello, {firstName}</AppText>
      </View>

      {isPending ? <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} /> : null}

      {message ? (
        <Card>
          <AppText variant="error">{message}</AppText>
          <Button title="Try again" variant="secondary" onPress={() => void refetch()} />
        </Card>
      ) : null}

      {data ? (
        <>
          {data.accounts.length === 0 ? (
            <Card>
              <AppText variant="heading">Add your first account</AppText>
              <AppText variant="muted">
                Add a cash, bank or wallet account on the website to start tracking. Account management arrives in the
                app in an upcoming step.
              </AppText>
            </Card>
          ) : null}
          <BalanceCard data={data} />
          <InsightsCard insights={data.insights} />
          <BudgetsCard budgets={data.budgets} overCount={data.over_budget_count} />
          <CategoryBreakdownCard data={data} />
          <TrendCard trend={data.trend} />
          <AccountsCard accounts={data.accounts} />
          <RecentCard transactions={data.recent} />
        </>
      ) : null}
    </ScrollScreen>
  );
}