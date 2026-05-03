import React, { useState } from "react";
import { Plus, MessageSquare, Trash2, Menu, X, Edit3 } from "lucide-react";

export default function Sidebar({ recentHistory, setRecentHistory, setSelectedHistory, startNewChat, fetchHistory, HISTORY_URL }) {
  const [isOpen, setIsOpen] = useState(false);

  const clearHistory = async () => {
    try {
      if (HISTORY_URL) {
        await fetch(HISTORY_URL, { method: "DELETE" });
      }
      setRecentHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const deleteItem = async (e, item) => {
    e.stopPropagation();
    try {
      if (HISTORY_URL && item.id) {
        await fetch(`${HISTORY_URL}/${item.id}`, { method: "DELETE" });
      }
      setRecentHistory(prev => prev.filter(i => (i.id ? i.id !== item.id : i !== item)));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSelectHistory = (item) => {
    setSelectedHistory(item);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle & Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full p-4 flex items-center justify-between z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors backdrop-blur-md"
        >
          {isOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
        </button>
        {!isOpen && (
          <button onClick={startNewChat} className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors backdrop-blur-md">
            <Edit3 className="w-5 h-5"/>
          </button>
        )}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed md:static top-0 left-0 h-full w-64 flex flex-col py-6 px-3 
        bg-[#f26e22] md:bg-transparent md:border-r md:border-white/20 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Desktop Header / New Chat */}
        <div className="flex items-center gap-2 mb-6 mt-12 md:mt-0 px-2">
          <div className="md:hidden text-white font-serif text-xl font-medium tracking-wide flex-1">
            Jinny AI
          </div>
          <button 
            onClick={startNewChat} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 w-full p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium border border-white/10"
          >
            <Plus className="w-5 h-5" />
            <span className="md:inline">New Chat</span>
          </button>
        </div>

        <div className="flex items-center justify-between px-3 mb-3 mt-4">
          <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Recent</span>
          {recentHistory.length > 0 && (
            <button onClick={clearHistory} className="text-white/60 hover:text-white transition-colors" title="Clear All History">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-1 px-1">
          {recentHistory.length === 0 ? (
            <p className="text-white/50 text-sm px-2 py-4 italic text-center">No recent chats</p>
          ) : (
            recentHistory.map((item, idx) => (
              <div 
                key={item.id || idx} 
                onClick={() => handleSelectHistory(item.prompt || item)}
                className="group flex items-center justify-between w-full p-2.5 hover:bg-white/15 rounded-xl cursor-pointer transition-colors text-white"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                  <span className="truncate text-sm opacity-90 group-hover:opacity-100">{item.prompt || item}</span>
                </div>
                <button 
                  onClick={(e) => deleteItem(e, item)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-300 transition-colors shrink-0"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

      </aside>
    </>
  );
}
