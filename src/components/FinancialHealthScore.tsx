import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialHealthScoreProps {
  score: number;
  tips: string[];
  isLoading: boolean;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-yellow-500";
  return "text-destructive";
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Improvement";
};

const FinancialHealthScore = ({ score, tips, isLoading }: FinancialHealthScoreProps) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Financial Health Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className={cn("text-5xl font-bold", getScoreColor(score))}>{score}</div>
              <p className="text-sm text-muted-foreground mt-1">out of 100 - {getScoreLabel(score)}</p>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className={cn("h-3 rounded-full transition-all", score >= 60 ? "bg-primary" : "bg-destructive")}
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>
            {tips.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Suggestions</p>
                {tips.map((tip, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{tip}</p>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialHealthScore;
