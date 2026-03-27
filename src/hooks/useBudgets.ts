import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useBudgets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const budgetsQuery = useQuery({
    queryKey: ["budgets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budgets")
        .select("*, categories(name, icon)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addBudget = useMutation({
    mutationFn: async (budget: { category_id: string; monthly_limit: number }) => {
      const { data, error } = await supabase
        .from("budgets")
        .upsert({ ...budget, user_id: user!.id }, { onConflict: "user_id,category_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["budget-summary"] });
      toast.success("Budget saved!");
    },
    onError: (error: any) => toast.error(error.message),
  });

  return { budgetsQuery, addBudget };
};
