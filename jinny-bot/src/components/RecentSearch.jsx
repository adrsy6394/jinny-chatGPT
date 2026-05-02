import React, { useState } from "react";

function RecentSearch({ recentHistory, setRecentHistory, setSelectedHistory }) {
  const [showHistory, setShowHistory] = useState(false);

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  const clearSelectedHistory = (selectedItem) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter((item) => item !== selectedItem);
    setRecentHistory(history);
    localStorage.setItem("history", JSON.stringify(history));
  };

  return (
    <div>
      {/* Responsive Toggle Button */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="sm:hidden fixed top-0 left-0 z-50 bg-zinc-800 text-white p-2 rounded"
      >
        {showHistory ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
          >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
          >
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
          </svg>
        )}
      </button>

      {/* Sidebar History Panel */}
      <div
        className={`col-span-1 dark:bg-zinc-800 bg-red-100 pt-8  h-screen overflow-auto scrollbar-hide 
        ${
          showHistory ? "block" : "hidden"
        } sm:block sm:w-48  fixed  top-0 left-0 z-40 `}
      >
        <h1 className="text-[16px] mx-2 -mt-2 dark:text-white text-zinc-800 dark:bg-black bg-red-300 flex text-center  justify-center fixed   sm:-left-2 sm:w-48  top-2  h-10 sm:px-0 md:px-1 lg:px-1">
          <span className="w-[150px] h-10 py-2 ">Recent Search</span>
          <button
            onClick={clearHistory}
            className="cursor-pointer hover:bg-zinc-900 bg-zinc-700 ml-2 rounded-full h-8 mt-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#e3e3e3"
            >
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
            </svg>
          </button>
        </h1>

        <ul className="text-left overflow-auto mt-8 w-48  sm:mt-6">
          {recentHistory &&
            recentHistory.map((item, index) => (
              <div key={index} className="flex  justify-between pr-3 py-1 ">
                <li
                  onClick={() => setSelectedHistory(item)}
                  className="w-full pl-5 px-5 truncate dark:text-zinc-400 text-zinc-700 cursor-pointer dark:hover:bg-zinc-700 dark:hover:text-zinc-200
             hover:bg-red-200 hover:text-zinc-800
             
             "
                >
                  {item}
                </li>
                <button
                  onClick={() => clearSelectedHistory(item)}
                  className="cursor-pointer hover:bg-zinc-900 bg-zinc-700 rounded-full h-8"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </button>
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default RecentSearch;
