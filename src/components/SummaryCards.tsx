import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  budgetTotal: number;
}

const SummaryCards = ({ income, expenses, budgetTotal }: SummaryCardsProps) => {
  const savings = income - expenses;
  const remaining = budgetTotal - expenses;

  const cards = [
    {
      title: "Total Income",
      value: income,
      icon: TrendingUp,
      colorClass: "text-income",
      bgClass: "bg-accent",
    },
    {
      title: "Total Expenses",
      value: expenses,
      icon: TrendingDown,
      colorClass: "text-expense",
      bgClass: "bg-destructive/10",
    },
    {
      title: "Savings",
      value: savings,
      icon: Wallet,
      colorClass: savings >= 0 ? "text-income" : "text-expense",
      bgClass: savings >= 0 ? "bg-accent" : "bg-destructive/10",
    },
    {
      title: "Remaining Budget",
      value: remaining,
      icon: PiggyBank,
      colorClass: remaining >= 0 ? "text-income" : "text-expense",
      bgClass: remaining >= 0 ? "bg-accent" : "bg-destructive/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border animate-fade-in">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", card.bgClass)}>
                <card.icon className={cn("w-5 h-5", card.colorClass)} />
              </div>
            </div>
            <p className={cn("text-2xl font-bold", card.colorClass)}>
              ₹{Math.abs(card.value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
