import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { View } from 'react-native';

import type { Account, Budget, DashboardData, Insight, Transaction } from '@/api/types';
import { BudgetProgress } from '@/components/budget-progress';
import { SectionCard } from '@/components/section-card';
import { TransactionRow } from '@/components/transaction-row';
import { AppText, Card } from '@/components/ui';
import { formatMoney, toCents } from '@/lib/money';
import { radius, space, useColors } from '@/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function BalanceCard({ data }: { data: DashboardData }) {
  const colors = useColors();

  return (
    <Card style={{ gap: space.lg }}>
      <View>
        <AppText variant="muted">Total balance</AppText>
        <AppText variant="title" style={{ fontSize: 34, fontVariant: ['tabular-nums'] }}>
          {formatMoney(data.total_balance)}
        </AppText>
      </View>
      <View style={{ flexDirection: 'row', gap: space.md }}>
        <Stat label="Income" value={formatMoney(data.income)} color={colors.income} />
        <Stat label="Spent" value={formatMoney(data.expense)} color={colors.expense} />
        <Stat label="Saved" value={formatMoney(data.saved)} color={colors.text} />
      </View>
    </Card>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <AppText variant="small">{label}</AppText>
      <AppText
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ color, fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] }}>
        {value}
      </AppText>
    </View>
  );
}

const INSIGHT_ICONS: Record<string, IconName> = {
  'bar-chart': 'bar-chart-outline',
  'arrow-up-right': 'trending-up',
  'arrow-down-left': 'trending-down',
  sparkles: 'sparkles-outline',
  'pie-chart': 'pie-chart-outline',
  wallet: 'wallet-outline',
  repeat: 'repeat',
};

export function InsightsCard({ insights }: { insights: Insight[] }) {
  const colors = useColors();

  if (insights.length === 0) {
    return null;
  }

  const toneColor = (tone: Insight['tone']) =>
    tone === 'good' ? colors.income : tone === 'warn' ? colors.warning : tone === 'bad' ? colors.expense : colors.accent;

  return (
    <SectionCard title="Insights">
      {insights.map((insight, index) => {
        const tint = toneColor(insight.tone);

        return (
          <View key={`${index}-${insight.text}`} style={{ flexDirection: 'row', gap: space.md, alignItems: 'flex-start' }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: radius.sm,
                backgroundColor: `${tint}26`,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name={INSIGHT_ICONS[insight.icon] ?? 'information-circle-outline'} size={18} color={tint} />
            </View>
            <AppText style={{ flex: 1, fontSize: 14, lineHeight: 20 }}>{insight.text}</AppText>
          </View>
        );
      })}
    </SectionCard>
  );
}

export function BudgetsCard({ budgets, overCount }: { budgets: Budget[]; overCount: number }) {
  const colors = useColors();

  const chip =
    overCount > 0 ? (
      <View style={{ backgroundColor: `${colors.expense}26`, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
        <AppText style={{ color: colors.expense, fontSize: 12, fontWeight: '600' }}>{overCount} over budget</AppText>
      </View>
    ) : undefined;

  return (
    <SectionCard title="Budgets" right={chip}>
      {budgets.length === 0 ? (
        <AppText variant="muted">No budgets yet. Monthly limits help keep spending on track.</AppText>
      ) : (
        budgets.map((budget) => <BudgetProgress key={budget.id} budget={budget} />)
      )}
    </SectionCard>
  );
}

export function CategoryBreakdownCard({ data }: { data: DashboardData }) {
  const colors = useColors();

  return (
    <SectionCard title="Spending by category" right={<AppText variant="small">{data.month_label}</AppText>}>
      {data.category_breakdown.length === 0 ? (
        <AppText variant="muted">No spending recorded this month yet.</AppText>
      ) : (
        data.category_breakdown.map((row) => (
          <View key={row.name} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: row.color }} />
                <AppText numberOfLines={1} style={{ flexShrink: 1 }}>
                  {row.name}
                </AppText>
              </View>
              <AppText variant="small" style={{ fontVariant: ['tabular-nums'] }}>
                {formatMoney(row.total)} · {row.percent}%
              </AppText>
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surface2, overflow: 'hidden' }}>
              <View
                style={{
                  height: 8,
                  width: `${Math.min(100, Math.max(0, row.percent))}%`,
                  backgroundColor: row.color,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        ))
      )}
    </SectionCard>
  );
}

const CHART_HEIGHT = 110;

export function TrendCard({ trend }: { trend: DashboardData['trend'] }) {
  const colors = useColors();
  const max = Math.max(1, ...trend.flatMap((month) => [toCents(month.income), toCents(month.expense)]));

  const barHeight = (value: string) => {
    const cents = toCents(value);

    return cents > 0 ? Math.max(3, (cents / max) * CHART_HEIGHT) : 0;
  };

  const legend = (
    <View style={{ flexDirection: 'row', gap: space.md }}>
      <Legend color={colors.income} label="Income" />
      <Legend color={colors.expense} label="Spent" />
    </View>
  );

  return (
    <SectionCard title="Last 6 months" right={legend}>
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        {trend.map((month) => (
          <View key={month.label} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            <View style={{ height: CHART_HEIGHT, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
              <View
                style={{
                  width: 10,
                  height: barHeight(month.income),
                  backgroundColor: colors.income,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
              />
              <View
                style={{
                  width: 10,
                  height: barHeight(month.expense),
                  backgroundColor: colors.expense,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
              />
            </View>
            <AppText variant="small">{month.label}</AppText>
          </View>
        ))}
      </View>
    </SectionCard>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <AppText variant="small">{label}</AppText>
    </View>
  );
}

export function AccountsCard({ accounts }: { accounts: Account[] }) {
  return (
    <SectionCard title="Accounts">
      {accounts.length === 0 ? (
        <AppText variant="muted">No accounts yet.</AppText>
      ) : (
        accounts.map((account) => (
          <View key={account.id} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: account.color ?? '#64748B' }} />
            <View style={{ flex: 1 }}>
              <AppText numberOfLines={1}>{account.name}</AppText>
              <AppText variant="small">{account.type_label}</AppText>
            </View>
            <AppText style={{ fontWeight: '600', fontVariant: ['tabular-nums'] }}>{formatMoney(account.balance)}</AppText>
          </View>
        ))
      )}
    </SectionCard>
  );
}

export function RecentCard({ transactions }: { transactions: Transaction[] }) {
  return (
    <SectionCard title="Recent activity">
      {transactions.length === 0 ? (
        <AppText variant="muted">Nothing recorded yet.</AppText>
      ) : (
        transactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)
      )}
    </SectionCard>
  );
}