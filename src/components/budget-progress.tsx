import { View } from 'react-native';

import type { Budget } from '@/api/types';
import { AppText } from '@/components/ui';
import { formatMoney, fromCents, toCents } from '@/lib/money';
import { useColors } from '@/theme';

export function BudgetProgress({ budget }: { budget: Budget }) {
  const colors = useColors();

  const barColor = budget.status === 'over' ? colors.expense : budget.status === 'warning' ? colors.warning : colors.accent;

  const note =
    budget.status === 'over'
      ? `Over by ${formatMoney(fromCents(toCents(budget.spent) - toCents(budget.limit)))}`
      : `${formatMoney(budget.remaining)} left`;

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: budget.color }} />
          <AppText numberOfLines={1} style={{ fontWeight: '500', flexShrink: 1 }}>
            {budget.name}
          </AppText>
        </View>
        <AppText variant="small" style={{ fontVariant: ['tabular-nums'] }}>
          {formatMoney(budget.spent)} / {formatMoney(budget.limit)}
        </AppText>
      </View>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surface2, overflow: 'hidden' }}>
        <View
          style={{
            height: 8,
            width: `${Math.min(100, Math.max(0, budget.percent))}%`,
            backgroundColor: barColor,
            borderRadius: 4,
          }}
        />
      </View>
      <AppText variant="small" style={{ color: budget.status === 'over' ? colors.expense : colors.muted }}>
        {note} · {budget.percent}% used
      </AppText>
    </View>
  );
}