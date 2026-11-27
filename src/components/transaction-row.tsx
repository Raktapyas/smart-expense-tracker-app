import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import type { Transaction } from '@/api/types';
import { AppText } from '@/components/ui';
import { formatDay } from '@/lib/dates';
import { formatMoney } from '@/lib/money';
import { radius, space, useColors } from '@/theme';

export function TransactionRow({ transaction, onPress }: { transaction: Transaction; onPress?: () => void }) {
  const colors = useColors();
  const isTransfer = transaction.type === 'transfer';
  const tint = transaction.category?.color ?? colors.muted;
  const icon = transaction.type === 'income' ? 'arrow-down' : transaction.type === 'expense' ? 'arrow-up' : 'swap-horizontal';

  const title = transaction.merchant || (isTransfer ? 'Transfer' : (transaction.category?.name ?? 'Uncategorised'));

  const where = isTransfer
    ? `${transaction.account?.name ?? ''} → ${transaction.transfer_account?.name ?? ''}`
    : (transaction.account?.name ?? '');
  const subtitle = [formatDay(transaction.occurred_on), where].filter(Boolean).join(' · ');

  const amountColor =
    transaction.type === 'income' ? colors.income : transaction.type === 'expense' ? colors.expense : colors.text;
  const sign = transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '−' : '';

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        opacity: pressed ? 0.7 : 1,
      })}>
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: radius.sm,
          backgroundColor: `${tint}33`,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name={icon} size={18} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText numberOfLines={1} style={{ fontWeight: '500' }}>
          {title}
        </AppText>
        <AppText variant="small" numberOfLines={1}>
          {subtitle}
        </AppText>
      </View>
      <AppText style={{ color: amountColor, fontWeight: '600', fontVariant: ['tabular-nums'] }}>
        {sign}
        {formatMoney(transaction.amount)}
      </AppText>
    </Pressable>
  );
}