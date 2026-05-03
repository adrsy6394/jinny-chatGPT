import React from "react";
import { Bell, Share } from "lucide-react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user?.name || 'User';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-8 py-4 bg-transparent z-10 relative">
      <div className="text-white text-xl font-medium tracking-wide pl-12 md:pl-0">
        Jinny AI
      </div>
      <div className="flex items-center gap-4 sm:gap-6 text-white pr-12 md:pr-0">
        <button className="hover:text-white/80 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="hover:text-white/80 transition-colors">
          <Share className="w-5 h-5" />
        </button>
        {/* User Name + Avatar */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-white/90 text-sm font-medium">
            {name}
          </span>
          <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/40 transition-colors text-white text-xs font-bold">
            {initials}
          </div>
        </div>
      </div>
    </nav>
  );
}
