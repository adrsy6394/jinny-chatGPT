import React, { useEffect, useRef, useState } from "react";
import { URL } from "./constant";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";
import SpeechTextInput from "./components/SpeechTextInput";
import DarkModeToggle from "./components/DarkModeToggle";
import { addEmojisToAnswer } from "./utils/emojiEnhancer";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const scrolltoAns = useRef(null);
  const [loader, setLoader] = useState(false);
  const [darkMode, setDarkMode] = useState("dark");

 



const askQuestion = async () => {
  if (!question && !selectedHistory) return;

  if (question) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = [question, ...history.slice(0, 19)];
    history = [...new Set(history)].map(
      (item) => item.charAt(0).toUpperCase() + item.slice(1).trim()
    );
    localStorage.setItem("history", JSON.stringify(history));
    setRecentHistory(history);
  }

  const payloadData = question || selectedHistory;
  const payload = {
    prompt: payloadData,
  };

  setLoader(true);

  try {
    let response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    response = await response.json();
    let dataString = response.answer;

    // ✅ Add emojis to API answer
    const emojiAnswer = addEmojisToAnswer(dataString);

    // ✅ Ensure scroll ref exists before continuing
    if (!scrolltoAns.current) return;

    // ✅ Show final answer with emojis
    showWordByWordAnswer(payloadData, emojiAnswer);
    setQuestion("");

    setTimeout(() => {
      if (scrolltoAns.current) {
        scrolltoAns.current.scrollTop = scrolltoAns.current.scrollHeight;
      }
    }, 500);
    setLoader(false);

  } catch (error) {
    console.error("Error while fetching:", error);
    setLoader(false);
  }
};





  const isEnter = (event) => {
    if (event.key === "Enter") askQuestion();
  };

  useEffect(() => {
    askQuestion();
  }, [selectedHistory]);

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const showWordByWordAnswer = (questionText, fullAnswer) => {
    if (!scrolltoAns.current) return;

    setResult((prev) => [...prev, { type: "q", text: questionText }]);

    const words = fullAnswer.split(" ");
    let index = 0;

    const interval = setInterval(() => {
      if (!scrolltoAns.current) {
        clearInterval(interval);
        return;
      }

      if (index < words.length) {
        setResult((prev) => {
          const lastItem = prev[prev.length - 1];

          if (lastItem?.type === "a") {
            const updatedText = lastItem.text + " " + words[index];
            return [...prev.slice(0, -1), { type: "a", text: updatedText }];
          } else {
            return [...prev, { type: "a", text: words[index] }];
          }
        });

        index++;
        scrolltoAns.current.scrollTop = scrolltoAns.current.scrollHeight;
      } else {
        clearInterval(interval);
        setLoader(false);
      }
    }, 80);
  };

  return (
    <div className="min-h-screen dark:bg-zinc-900 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-5 h-full overflow-hidden md:px-10">
        <div className="md:col-span-1 h-full overflow-y-auto p-2 border-r border-zinc-700 ">
          <RecentSearch
            recentHistory={recentHistory}
            setRecentHistory={setRecentHistory}
            setSelectedHistory={setSelectedHistory}
          />
        </div>

        <div className="md:col-span-4 flex flex-col h-full sm:pl-48 sm:pr-12 md:px-10 ">
          <div className="p-4 text-center ">
            <h1 className="text-4xl  font-bold
             text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 animate-gradient">
              I'm Jinny, How can I help you, dear 💬
            </h1>
          </div>

          <div
            ref={scrolltoAns}
            className="flex-1 overflow-y-auto px-4 pb-32 text-zinc-800 dark:text-zinc-300"
          >
            <ul>
              {result.map((item, index) => (
                <QuestionAnswer key={index} item={item} index={index} />
              ))}
              {loader && (
                <div className="flex items-center justify-end px-5 pb-3">
                  <div
                    className="bg-zinc-100 dark:bg-zinc-700 text-black dark:text-white 
                    px-4 py-3 rounded-2xl rounded-br-none w-fit shadow-sm"
                  >
                    <div className="flex gap-1 text-xl font-bold">
                      <span className="animate-bounce [animation-delay:-0.3s]">
                        .
                      </span>
                      <span className="animate-bounce [animation-delay:-0.15s]">
                        .
                      </span>
                      <span className="animate-bounce">.</span>
                    </div>
                  </div>
                </div>
              )}
            </ul>
          </div>

          <div className="fixed bottom-0 left-0 w-full px-4 py-3 bg-white dark:bg-zinc-800 border-t dark:border-zinc-700 flex flex-col sm:flex-col sm:w-screen sm:ml-40 sm:px-12 rounded-2xl items-center gap-2">
            <div className="fixed bottom-0 left-0 w-full px-4 py-3 bg-white dark:bg-zinc-800 border-t dark:border-zinc-700">
              <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-2 px-4">
                <SpeechTextInput
                  question={question}
                  setQuestion={setQuestion}
                  askQuestion={askQuestion}
                />
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
