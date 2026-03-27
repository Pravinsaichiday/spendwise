import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  note: string | null;
  created_at: string;
  categories?: { name: string; icon: string | null };
}

export const useTransactions = (month?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ["transactions", user?.id, month],
    queryFn: async () => {
      let query = supabase
        .from("transactions")
        .select("*, categories(name, icon)")
        .order("date", { ascending: false });

      if (month) {
        const start = `${month}-01`;
        const endDate = new Date(parseInt(month.split("-")[0]), parseInt(month.split("-")[1]), 0);
        const end = `${month}-${endDate.getDate().toString().padStart(2, "0")}`;
        query = query.gte("date", start).lte("date", end);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });

  const addTransaction = useMutation({
    mutationFn: async (tx: {
      category_id: string;
      type: "income" | "expense";
      amount: number;
      date: string;
      note?: string;
    }) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert({ ...tx, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;

      // Check budget alert for expenses
      if (tx.type === "expense") {
        await checkBudgetAlert(tx.category_id, tx.date);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["budget-summary"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Transaction added!");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["budget-summary"] });
      toast.success("Transaction deleted!");
    },
    onError: (error: any) => toast.error(error.message),
  });

  const checkBudgetAlert = async (categoryId: string, date: string) => {
    const month = date.substring(0, 7);
    const start = `${month}-01`;
    const endDate = new Date(parseInt(month.split("-")[0]), parseInt(month.split("-")[1]), 0);
    const end = `${month}-${endDate.getDate().toString().padStart(2, "0")}`;

    // Get budget for this category
    const { data: budget } = await supabase
      .from("budgets")
      .select("monthly_limit")
      .eq("user_id", user!.id)
      .eq("category_id", categoryId)
      .single();

    if (!budget) return;

    // Get total spent
    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", user!.id)
      .eq("category_id", categoryId)
      .eq("type", "expense")
      .gte("date", start)
      .lte("date", end);

    const totalSpent = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    const percentage = (totalSpent / Number(budget.monthly_limit)) * 100;

    if (percentage >= 80) {
      // Get category name
      const { data: category } = await supabase
        .from("categories")
        .select("name")
        .eq("id", categoryId)
        .single();

      await supabase.from("budget_alerts").insert({
        user_id: user!.id,
        category_id: categoryId,
        percentage_used: Math.round(percentage * 100) / 100,
        message: `${category?.name || "Category"} spending is at ${Math.round(percentage)}% of your budget!`,
      });
    }
  };

  return { transactionsQuery, addTransaction, deleteTransaction };
};
