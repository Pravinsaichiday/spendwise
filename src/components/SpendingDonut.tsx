import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Transaction } from "@/hooks/useTransactions";

interface SpendingDonutProps {
  transactions: Transaction[];
}

const COLORS = [
  "hsl(152, 60%, 36%)",
  "hsl(200, 70%, 50%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 72%, 51%)",
  "hsl(180, 60%, 40%)",
  "hsl(320, 60%, 50%)",
  "hsl(60, 70%, 45%)",
  "hsl(220, 60%, 55%)",
  "hsl(100, 50%, 40%)",
];

const SpendingDonut = ({ transactions }: SpendingDonutProps) => {
  const expenses = transactions.filter((t) => t.type === "expense");
  
  const categoryTotals: Record<string, { name: string; value: number }> = {};
  expenses.forEach((t) => {
    const name = t.categories?.name || "Unknown";
    if (!categoryTotals[name]) categoryTotals[name] = { name, value: 0 };
    categoryTotals[name].value += Number(t.amount);
  });

  const data = Object.values(categoryTotals).sort((a, b) => b.value - a.value);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-sm text-muted-foreground">No expenses this month</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base">Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                `₹${value.toLocaleString("en-IN")} (${Math.round((value / total) * 100)}%)`,
                "Amount",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="truncate text-muted-foreground">{d.name}</span>
              <span className="ml-auto font-medium">₹{d.value.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingDonut;
