import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useAlerts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const alertsQuery = useQuery({
    queryKey: ["alerts", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_alerts")
        .select("*, categories(name, icon)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const dismissAlert = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("budget_alerts")
        .update({ status: "read" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast.success("Alert dismissed");
    },
  });

  return { alertsQuery, dismissAlert };
};
