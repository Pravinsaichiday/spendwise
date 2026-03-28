import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Transaction } from "./useTransactions";
import { BudgetSummaryItem } from "./useBudgetSummary";

interface InsightsResult {
  insights: string[];
  health_score: number;
  health_tips: string[];
}

export const useSpendingInsights = (
  transactions: Transaction[],
  budgetSummary: BudgetSummaryItem[] | undefined,
  month: string
) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["spending-insights", user?.id, month, transactions.length],
    queryFn: async (): Promise<InsightsResult> => {
      const simplifiedTx = transactions.map((t) => ({
        type: t.type,
        amount: t.amount,
        date: t.date,
        category: t.categories?.name || "Unknown",
      }));

      const simplifiedBudgets = (budgetSummary || []).map((b) => ({
        category: b.category,
        spent: b.spent,
        budget: b.budget,
        percentage: b.percentage,
      }));

      const { data, error } = await supabase.functions.invoke("spending-insights", {
        body: { transactions: simplifiedTx, budgets: simplifiedBudgets, month },
      });

      if (error) throw error;
      return data as InsightsResult;
    },
    enabled: !!user && transactions.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
