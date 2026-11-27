import { ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  View,
  ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { radius, space, useColors } from '@/theme';

export function Screen({ children, scroll = false }: { children: ReactNode; scroll?: boolean }) {
  const colors = useColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        ) : (
          <View style={styles.content}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type Variant = 'title' | 'heading' | 'body' | 'muted' | 'small' | 'error';

export function AppText({ variant = 'body', style, ...props }: TextProps & { variant?: Variant }) {
  const colors = useColors();

  const variants = {
    title: { fontSize: 28, fontWeight: '700', color: colors.text },
    heading: { fontSize: 18, fontWeight: '600', color: colors.text },
    body: { fontSize: 16, color: colors.text },
    muted: { fontSize: 14, color: colors.muted },
    small: { fontSize: 12, color: colors.muted },
    error: { fontSize: 13, color: colors.expense },
  } satisfies Record<Variant, TextStyle>;

  return <Text {...props} style={[variants[variant], style]} />;
}

export function Card({ style, ...props }: ViewProps) {
  const colors = useColors();

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.line,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: radius.lg,
          padding: space.lg,
          gap: space.md,
        },
        style,
      ]}
    />
  );
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({ title, onPress, loading = false, disabled = false, variant = 'primary' }: ButtonProps) {
  const colors = useColors();
  const inactive = disabled || loading;

  const background = variant === 'primary' ? colors.accent : variant === 'danger' ? colors.expense : colors.surface2;
  const textColor = variant === 'primary' ? colors.accentText : variant === 'danger' ? '#ffffff' : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: background,
        borderColor: colors.line,
        borderWidth: variant === 'secondary' ? StyleSheet.hairlineWidth : 0,
        borderRadius: radius.md,
        paddingVertical: 14,
        alignItems: 'center',
        opacity: inactive ? 0.6 : pressed ? 0.85 : 1,
      })}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={{ color: textColor, fontSize: 16, fontWeight: '600' }}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Field({ label, error, ...input }: TextInputProps & { label: string; error?: string }) {
  const colors = useColors();

  return (
    <View style={{ gap: 6 }}>
      <AppText variant="muted">{label}</AppText>
      <TextInput
        placeholderTextColor={colors.muted}
        {...input}
        style={{
          backgroundColor: colors.surface2,
          color: colors.text,
          borderColor: error ? colors.expense : colors.line,
          borderWidth: 1,
          borderRadius: radius.md,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 16,
        }}
      />
      {error ? <AppText variant="error">{error}</AppText> : null}
    </View>
  );
}

export function Brand() {
  const colors = useColors();

  return (
    <View style={{ alignItems: 'center', gap: space.md, marginBottom: space.md }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          backgroundColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ color: colors.accentText, fontSize: 28, fontWeight: '700' }}>₨</Text>
      </View>
      <AppText variant="heading">Smart Expense Tracker</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: space.xl, gap: space.lg },
});