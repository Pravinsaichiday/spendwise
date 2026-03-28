import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Loader2 } from "lucide-react";

interface AIInsightsCardProps {
  insights: string[];
  isLoading: boolean;
}

const AIInsightsCard = ({ insights, isLoading }: AIInsightsCardProps) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          AI Spending Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Analyzing your spending...</span>
          </div>
        ) : insights.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add more transactions to get AI insights.</p>
        ) : (
          <ul className="space-y-3">
            {insights.map((insight, i) => (
              <li key={i} className="text-sm leading-relaxed pl-1">
                {insight}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsCard;
