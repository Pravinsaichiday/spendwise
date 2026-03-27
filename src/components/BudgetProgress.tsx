import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BudgetSummaryItem } from "@/hooks/useBudgetSummary";
import { cn } from "@/lib/utils";

interface BudgetProgressProps {
  items: BudgetSummaryItem[];
}

const BudgetProgress = ({ items }: BudgetProgressProps) => {
  const getColor = (pct: number) => {
    if (pct < 60) return "bg-primary";
    if (pct < 80) return "bg-warning";
    return "bg-destructive";
  };

  const getTextColor = (pct: number) => {
    if (pct < 60) return "text-primary";
    if (pct < 80) return "text-warning";
    return "text-destructive";
  };

  if (items.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No budgets set. Go to Budgets to create one.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">Budget Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.category_id} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.category}</span>
              <span className={cn("font-semibold", getTextColor(item.percentage))}>
                {item.percentage}%
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", getColor(item.percentage))}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹{item.spent.toLocaleString("en-IN")}</span>
              <span>₹{item.budget.toLocaleString("en-IN")}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
