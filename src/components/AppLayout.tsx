import { ReactNode } from "react";
import AppSidebar from "@/components/AppSidebar";
import AppNavbar from "@/components/AppNavbar";

interface AppLayoutProps {
  children: ReactNode;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

const AppLayout = ({ children, selectedMonth, onMonthChange }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppNavbar selectedMonth={selectedMonth} onMonthChange={onMonthChange} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
