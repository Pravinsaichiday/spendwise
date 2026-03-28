import SummaryCards from "@/components/SummaryCards";
import BudgetProgress from "@/components/BudgetProgress";
import SpendingDonut from "@/components/SpendingDonut";
import AlertsPanel from "@/components/AlertsPanel";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";

interface DashboardPageProps {
  selectedMonth: string;
}

const DashboardPage = ({ selectedMonth }: DashboardPageProps) => {
  const { transactionsQuery } = useTransactions(selectedMonth);
  const { data: budgetSummary } = useBudgetSummary(selectedMonth);

  const transactions = transactionsQuery.data || [];
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const budgetTotal = budgetSummary?.reduce((sum, b) => sum + b.budget, 0) || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your financial overview at a glance</p>
      </div>

      <SummaryCards income={income} expenses={expenses} budgetTotal={budgetTotal} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetProgress items={budgetSummary || []} />
        <SpendingDonut transactions={transactions} />
      </div>

      <AlertsPanel />
    </div>
  );
};

export default DashboardPage;
