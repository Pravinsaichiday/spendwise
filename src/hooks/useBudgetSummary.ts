import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface BudgetSummaryItem {
  category: string;
  category_id: string;
  spent: number;
  budget: number;
  percentage: number;
}

export const useBudgetSummary = (month: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["budget-summary", user?.id, month],
    queryFn: async () => {
      const start = `${month}-01`;
      const endDate = new Date(parseInt(month.split("-")[0]), parseInt(month.split("-")[1]), 0);
      const end = `${month}-${endDate.getDate().toString().padStart(2, "0")}`;

      // Get budgets
      const { data: budgets } = await supabase
        .from("budgets")
        .select("*, categories(name)")
        .eq("user_id", user!.id);

      // Get expenses for the month
      const { data: transactions } = await supabase
        .from("transactions")
        .select("category_id, amount")
        .eq("user_id", user!.id)
        .eq("type", "expense")
        .gte("date", start)
        .lte("date", end);

      const spentByCategory: Record<string, number> = {};
      transactions?.forEach((t) => {
        spentByCategory[t.category_id] = (spentByCategory[t.category_id] || 0) + Number(t.amount);
      });

      const summary: BudgetSummaryItem[] = (budgets || []).map((b: any) => ({
        category: b.categories?.name || "Unknown",
        category_id: b.category_id,
        spent: spentByCategory[b.category_id] || 0,
        budget: Number(b.monthly_limit),
        percentage: Math.round(((spentByCategory[b.category_id] || 0) / Number(b.monthly_limit)) * 100),
      }));

      return summary;
    },
    enabled: !!user,
  });
};
