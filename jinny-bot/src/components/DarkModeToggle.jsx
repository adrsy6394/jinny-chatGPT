import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react"; // Optional icons from lucide-react

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex items-center space-x-3 md:ml-48 sm:ml-36">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {darkMode ? "Dark Mode" : "Light Mode"}
      </span>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 
          ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 
            ${darkMode ? "translate-x-6" : "translate-x-0"}`}
        >
          <div className="flex justify-center items-center h-full">
            {darkMode ? (
              <Moon className="w-4 h-4 text-gray-800" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        </div>
      </button>
    </div>
  );
};

export default DarkModeToggle;
