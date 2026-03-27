import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { useBudgets } from "@/hooks/useBudgets";
import { useBudgetSummary } from "@/hooks/useBudgetSummary";
import { useCategories } from "@/hooks/useCategories";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface BudgetsPageProps {
  selectedMonth: string;
}

const BudgetsPage = ({ selectedMonth }: BudgetsPageProps) => {
  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState("");

  const { budgetsQuery, addBudget } = useBudgets();
  const { data: summary } = useBudgetSummary(selectedMonth);
  const { data: categories } = useCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !limit) return;
    addBudget.mutate(
      { category_id: categoryId, monthly_limit: parseFloat(limit) },
      {
        onSuccess: () => {
          setCategoryId("");
          setLimit("");
          setShowForm(false);
        },
      }
    );
  };

  const getProgressColor = (pct: number) => {
    if (pct < 60) return "bg-primary";
    if (pct < 80) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-sm text-muted-foreground">Set and track monthly spending limits</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Set Budget
        </Button>
      </div>

      {(!summary || summary.length === 0) ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No budgets set yet. Create your first budget!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.map((item) => {
            const remaining = item.budget - item.spent;
            return (
              <Card key={item.category_id} className="border-border animate-fade-in">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{item.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Limit</span>
                    <span className="font-semibold">₹{item.budget.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="font-semibold text-expense">₹{item.spent.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className={cn("font-semibold", remaining >= 0 ? "text-income" : "text-expense")}>
                      ₹{Math.abs(remaining).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", getProgressColor(item.percentage))}
                      style={{ width: `${Math.min(item.percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{item.percentage}% used</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set Budget</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Monthly Limit (₹)</Label>
              <Input
                type="number"
                placeholder="5000"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                min="1"
                step="1"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={addBudget.isPending}>
              {addBudget.isPending ? "Saving..." : "Save Budget"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetsPage;
