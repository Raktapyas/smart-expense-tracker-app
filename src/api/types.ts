export type User = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type Account = {
  id: number;
  name: string;
  type: string;
  type_label: string;
  currency: string;
  opening_balance: string;
  balance: string;
  color: string | null;
  icon: string | null;
  is_archived: boolean;
};

export type TransactionType = 'income' | 'expense' | 'transfer';

export type Transaction = {
  id: number;
  type: TransactionType;
  amount: string;
  occurred_on: string;
  merchant: string | null;
  note: string | null;
  account_id: number;
  transfer_account_id: number | null;
  category_id: number | null;
  account?: { id: number; name: string };
  transfer_account?: { id: number; name: string } | null;
  category?: { id: number; name: string; color: string | null; icon: string | null } | null;
  recurring_transaction_id: number | null;
  created_at: string | null;
};

export type Budget = {
  id: number;
  category_id: number | null;
  name: string;
  color: string;
  limit: string;
  spent: string;
  remaining: string;
  percent: number;
  status: 'ok' | 'warning' | 'over';
};

export type Insight = {
  tone: 'good' | 'info' | 'warn' | 'bad';
  icon: string;
  text: string;
  action: { label: string; target: string } | null;
};

export type DashboardData = {
  month_label: string;
  total_balance: string;
  income: string;
  expense: string;
  saved: string;
  accounts: Account[];
  category_breakdown: { name: string; color: string; total: string; percent: number }[];
  trend: { label: string; income: string; expense: string }[];
  recent: Transaction[];
  budgets: Budget[];
  over_budget_count: number;
  insights: Insight[];
};