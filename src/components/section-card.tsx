import { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText, Card } from '@/components/ui';

export function SectionCard({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppText variant="heading">{title}</AppText>
        {right}
      </View>
      {children}
    </Card>
  );
}