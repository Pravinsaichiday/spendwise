import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TransactionFormDialog from "@/components/TransactionFormDialog";

interface AppNavbarProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const AppNavbar = ({ selectedMonth, onMonthChange }: AppNavbarProps) => {
  const [showForm, setShowForm] = useState(false);

  const navigateMonth = (direction: number) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const d = new Date(year, month - 1 + direction, 1);
    onMonthChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const monthLabel = new Date(
    parseInt(selectedMonth.split("-")[0]),
    parseInt(selectedMonth.split("-")[1]) - 1
  ).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} className="h-8 w-8">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="font-semibold text-sm min-w-[140px] text-center">{monthLabel}</span>
        <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} className="h-8 w-8">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <Button size="sm" onClick={() => setShowForm(true)} className="gap-2">
        <Plus className="w-4 h-4" />
        Add Transaction
      </Button>
      <TransactionFormDialog open={showForm} onOpenChange={setShowForm} />
    </header>
  );
};

export default AppNavbar;
