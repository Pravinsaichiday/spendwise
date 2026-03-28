import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { Transaction } from "@/hooks/useTransactions";
import { BudgetSummaryItem } from "@/hooks/useBudgetSummary";

interface PredictiveForecastProps {
  transactions: Transaction[];
  budgetSummary: BudgetSummaryItem[];
  selectedMonth: string;
}

const PredictiveForecast = ({ transactions, budgetSummary, selectedMonth }: PredictiveForecastProps) => {
  const now = new Date();
  const [year, monthNum] = selectedMonth.split("-").map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const currentDay = year === now.getFullYear() && monthNum === now.getMonth() + 1
    ? now.getDate()
    : daysInMonth;
  const remainingDays = Math.max(0, daysInMonth - currentDay);

  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const dailyAvg = currentDay > 0 ? totalExpenses / currentDay : 0;
  const predictedTotal = totalExpenses + dailyAvg * remainingDays;

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const predictedSavings = income - predictedTotal;

  // Category predictions
  const categorySpend: Record<string, number> = {};
  expenses.forEach((t) => {
    const cat = t.categories?.name || "Other";
    categorySpend[cat] = (categorySpend[cat] || 0) + Number(t.amount);
  });

  const overBudgetCategories = budgetSummary
    .map((b) => {
      const spent = b.spent;
      const catDailyAvg = currentDay > 0 ? spent / currentDay : 0;
      const predicted = spent + catDailyAvg * remainingDays;
      const overBy = predicted - b.budget;
      return { category: b.category, predicted, budget: b.budget, overBy };
    })
    .filter((c) => c.overBy > 0);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          End-of-Month Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Predicted Expenses</p>
            <p className="text-lg font-bold text-destructive">
              ₹{predictedTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground">Expected Savings</p>
            <p className={`text-lg font-bold ${predictedSavings >= 0 ? "text-primary" : "text-destructive"}`}>
              ₹{predictedSavings.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Based on ₹{dailyAvg.toLocaleString("en-IN", { maximumFractionDigits: 0 })}/day avg with {remainingDays} days remaining
        </div>

        {overBudgetCategories.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-warning" />
              Predicted Overspending
            </p>
            {overBudgetCategories.map((c) => (
              <div key={c.category} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{c.category}</span>
                <span className="text-destructive font-medium">
                  +₹{c.overBy.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        )}

        {overBudgetCategories.length === 0 && totalExpenses > 0 && (
          <p className="text-sm text-primary">You are on track with all budgets!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveForecast;
