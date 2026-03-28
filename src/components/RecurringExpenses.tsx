import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Transaction } from "@/hooks/useTransactions";

interface RecurringExpensesProps {
  transactions: Transaction[];
}

interface RecurringItem {
  category: string;
  amount: number;
  count: number;
  note: string | null;
}

const RecurringExpenses = ({ transactions }: RecurringExpensesProps) => {
  // Detect recurring: group by similar amounts (within 5%) in the same category
  const expenses = transactions.filter((t) => t.type === "expense");

  const amountGroups: Record<string, { amounts: number[]; notes: string[]; category: string }> = {};

  expenses.forEach((t) => {
    const rounded = Math.round(Number(t.amount) / 10) * 10;
    const key = `${t.categories?.name || "Other"}_${rounded}`;
    if (!amountGroups[key]) {
      amountGroups[key] = { amounts: [], notes: [], category: t.categories?.name || "Other" };
    }
    amountGroups[key].amounts.push(Number(t.amount));
    if (t.note) amountGroups[key].notes.push(t.note);
  });

  const recurring: RecurringItem[] = Object.values(amountGroups)
    .filter((g) => g.amounts.length >= 2)
    .map((g) => ({
      category: g.category,
      amount: Math.round(g.amounts.reduce((a, b) => a + b, 0) / g.amounts.length),
      count: g.amounts.length,
      note: g.notes[0] || null,
    }))
    .sort((a, b) => b.amount - a.amount);

  const totalRecurring = recurring.reduce((sum, r) => sum + r.amount, 0);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary" />
          Recurring Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recurring.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recurring expenses detected yet.</p>
        ) : (
          <div className="space-y-3">
            {recurring.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.note || item.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.category} - {item.count}x this period
                  </p>
                </div>
                <span className="text-sm font-semibold text-destructive">
                  ₹{item.amount.toLocaleString("en-IN")}/mo
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-border flex justify-between">
              <span className="text-sm font-medium">Total Recurring</span>
              <span className="text-sm font-bold">
                ₹{totalRecurring.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecurringExpenses;
