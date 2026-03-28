import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Trash2, Edit2 } from "lucide-react";
import { useSavingsGoals } from "@/hooks/useSavingsGoals";

const GoalsPage = () => {
  const { goalsQuery, addGoal, updateGoal, deleteGoal } = useSavingsGoals();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");

  const goals = goalsQuery.data || [];

  const openAdd = () => {
    setEditId(null);
    setName("");
    setTarget("");
    setCurrent("0");
    setDialogOpen(true);
  };

  const openEdit = (goal: any) => {
    setEditId(goal.id);
    setName(goal.name);
    setTarget(String(goal.target_amount));
    setCurrent(String(goal.current_amount));
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;

    if (editId) {
      updateGoal.mutate(
        { id: editId, name, target_amount: parseFloat(target), current_amount: parseFloat(current || "0") },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      addGoal.mutate(
        { name, target_amount: parseFloat(target), current_amount: parseFloat(current || "0") },
        { onSuccess: () => setDialogOpen(false) }
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Savings Goals</h1>
          <p className="text-sm text-muted-foreground">Track your financial goals</p>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">No goals yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first savings goal to start tracking</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const percentage = Math.min(
              Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100),
              100
            );
            const remaining = Math.max(0, Number(goal.target_amount) - Number(goal.current_amount));

            return (
              <Card key={goal.id} className="border-border">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    {goal.name}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(goal)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => deleteGoal.mutate(goal.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ₹{Number(goal.current_amount).toLocaleString("en-IN")} saved
                    </span>
                    <span className="font-medium">
                      ₹{Number(goal.target_amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{percentage}% complete</span>
                    <span>₹{remaining.toLocaleString("en-IN")} remaining</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Goal" : "Create Goal"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Goal Name</Label>
              <Input placeholder="e.g. Trip Fund" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Target Amount (₹)</Label>
              <Input type="number" placeholder="50000" value={target} onChange={(e) => setTarget(e.target.value)} min="1" required />
            </div>
            <div className="space-y-2">
              <Label>Current Savings (₹)</Label>
              <Input type="number" placeholder="0" value={current} onChange={(e) => setCurrent(e.target.value)} min="0" />
            </div>
            <Button type="submit" className="w-full" disabled={addGoal.isPending || updateGoal.isPending}>
              {editId ? "Update Goal" : "Create Goal"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GoalsPage;
