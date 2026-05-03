import React from "react";
import { Bell, Share, User } from "lucide-react";

export default function Navbar() {
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
        <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
