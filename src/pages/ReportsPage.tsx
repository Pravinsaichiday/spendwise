import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import SpendingDonut from "@/components/SpendingDonut";
import { useTransactions } from "@/hooks/useTransactions";
import { useSavingsTrend } from "@/hooks/useSavingsTrend";

interface ReportsPageProps {
  selectedMonth: string;
}

const ReportsPage = ({ selectedMonth }: ReportsPageProps) => {
  const { transactionsQuery } = useTransactions(selectedMonth);
  const { data: savingsTrend } = useSavingsTrend();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">Visual insights into your finances</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingDonut transactions={transactionsQuery.data || []} />

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Savings Trend (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {!savingsTrend || savingsTrend.length === 0 ? (
              <div className="flex items-center justify-center h-[250px]">
                <p className="text-sm text-muted-foreground">No data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={savingsTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`}
                    contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="hsl(152, 60%, 36%)" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
