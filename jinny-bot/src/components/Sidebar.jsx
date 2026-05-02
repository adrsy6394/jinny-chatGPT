import React from "react";
import { Home, Search, LayoutDashboard, BookOpen, History, Wallet, Settings } from "lucide-react";

export default function Sidebar() {
  const iconClass = "w-5 h-5 text-white/70 hover:text-white transition-colors cursor-pointer";

  return (
    <aside className="w-16 sm:w-20 h-full flex flex-col items-center py-8 border-r border-white/10 z-10">
      <div className="flex flex-col gap-8 flex-1 mt-10">
        <Home className={iconClass} />
        <Search className={iconClass} />
        <LayoutDashboard className={iconClass} />
        <BookOpen className={iconClass} />
        <History className={iconClass} />
        <Wallet className={iconClass} />
      </div>
      <div className="mt-auto mb-4">
        <Settings className={iconClass} />
      </div>
    </aside>
  );
}
