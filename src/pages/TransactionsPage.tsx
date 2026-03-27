import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import TransactionFormDialog from "@/components/TransactionFormDialog";
import { cn } from "@/lib/utils";

interface TransactionsPageProps {
  selectedMonth: string;
}

const TransactionsPage = ({ selectedMonth }: TransactionsPageProps) => {
  const [showForm, setShowForm] = useState(false);
  const { transactionsQuery, deleteTransaction } = useTransactions(selectedMonth);
  const transactions = transactionsQuery.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground">Manage your income and expenses</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      <Card className="border-border">
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No transactions this month. Add one to get started!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="animate-fade-in">
                    <TableCell className="text-sm">
                      {new Date(tx.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell className="font-medium">{tx.categories?.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={tx.type === "income" ? "default" : "destructive"}
                        className={cn(
                          "text-xs",
                          tx.type === "income" ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"
                        )}
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn("text-right font-semibold font-mono", tx.type === "income" ? "text-income" : "text-expense")}>
                      {tx.type === "income" ? "+" : "-"}₹{Number(tx.amount).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {tx.note || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTransaction.mutate(tx.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TransactionFormDialog open={showForm} onOpenChange={setShowForm} />
    </div>
  );
};

export default TransactionsPage;
