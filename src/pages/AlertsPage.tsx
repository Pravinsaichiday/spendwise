import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, X } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import { cn } from "@/lib/utils";

const AlertsPage = () => {
  const { alertsQuery, dismissAlert } = useAlerts();
  const alerts = alertsQuery.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Alerts</h1>
        <p className="text-sm text-muted-foreground">Budget warnings and notifications</p>
      </div>

      {alerts.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Check className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">All clear!</p>
            <p className="text-sm text-muted-foreground mt-1">No budget alerts at the moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={cn(
                "border-border animate-fade-in",
                alert.status === "read" && "opacity-60"
              )}
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{alert.message}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {(alert as any).categories?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                {alert.status === "unread" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dismissAlert.mutate(alert.id)}
                    className="shrink-0"
                  >
                    Dismiss
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
