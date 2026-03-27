import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SavingsTrendItem {
  month: string;
  income: number;
  expense: number;
}

export const useSavingsTrend = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["savings-trend", user?.id],
    queryFn: async () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      const startDate = `${sixMonthsAgo.getFullYear()}-${String(sixMonthsAgo.getMonth() + 1).padStart(2, "0")}-01`;

      const { data, error } = await supabase
        .from("transactions")
        .select("type, amount, date")
        .eq("user_id", user!.id)
        .gte("date", startDate)
        .order("date");

      if (error) throw error;

      const monthMap: Record<string, { income: number; expense: number }> = {};
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthMap[key] = { income: 0, expense: 0 };
      }

      data?.forEach((t) => {
        const key = t.date.substring(0, 7);
        if (monthMap[key]) {
          monthMap[key][t.type as "income" | "expense"] += Number(t.amount);
        }
      });

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      return Object.entries(monthMap).map(([key, val]) => ({
        month: months[parseInt(key.split("-")[1]) - 1],
        income: val.income,
        expense: val.expense,
      }));
    },
    enabled: !!user,
  });
};
