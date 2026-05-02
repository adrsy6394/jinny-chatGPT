import React, { useEffect, useRef, useState } from "react";
import { URL } from "./constant";
import QuestionAnswer from "./components/QuestionAnswer";
import SpeechTextInput from "./components/SpeechTextInput";
import { addEmojisToAnswer } from "./utils/emojiEnhancer";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [loader, setLoader] = useState(false);
  const scrolltoAns = useRef(null);

  const askQuestion = async (overrideQuestion) => {
    const textToAsk = overrideQuestion || question;
    if (!textToAsk) return;

    const payloadData = textToAsk;
    const payload = {
      prompt: payloadData,
    };

    setLoader(true);
    setQuestion("");

    try {
      let response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      response = await response.json();
      let dataString = response.answer || "I'm sorry, I couldn't get a response.";

      const emojiAnswer = addEmojisToAnswer(dataString);

      if (!scrolltoAns.current && result.length > 0) return;

      showWordByWordAnswer(payloadData, emojiAnswer);

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

  const showWordByWordAnswer = (questionText, fullAnswer) => {
    setResult((prev) => [...prev, { type: "q", text: questionText }]);

    const words = fullAnswer.split(" ");
    let index = 0;

    const interval = setInterval(() => {
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
        if (scrolltoAns.current) {
          scrolltoAns.current.scrollTop = scrolltoAns.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setLoader(false);
      }
    }, 40); // Faster typing speed
  };

  const suggestions = [
    "I'd like support in writing an email.",
    "Explain the concept clearly.",
    "Create a daily plan"
  ];

  const isChatActive = result.length > 0;

  return (
    <div className="min-h-screen bg-app-gradient flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Navbar />

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center overflow-y-auto px-4 sm:px-8 w-full relative" ref={scrolltoAns}>
          
          {!isChatActive ? (
            // Empty State
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mt-20 animate-fade-in">
              <h1 className="text-4xl sm:text-5xl md:text-6xl text-white font-serif font-medium text-center mb-4 tracking-wide drop-shadow-md">
                What do you need help with today?
              </h1>
              <p className="text-white/80 text-lg sm:text-xl font-light mb-12 text-center">
                Tell me what you need, and I'll make it happen.
              </p>

              <SpeechTextInput
                question={question}
                setQuestion={setQuestion}
                askQuestion={() => askQuestion()}
                isChatActive={false}
              />

              <div className="flex flex-wrap justify-center gap-4 mt-8">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => askQuestion(sug)}
                    className="px-6 py-3 rounded-full bg-white text-gray-800 text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chat State
            <div className="w-full max-w-4xl mx-auto flex flex-col pb-64 pt-4">
              {result.map((item, index) => (
                <QuestionAnswer key={index} item={item} index={index} />
              ))}
              {loader && (
                <div className="flex justify-start mb-6">
                  <div className="glass-panel text-gray-800 px-6 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <span className="animate-bounce [animation-delay:-0.3s] w-2 h-2 bg-[#f26e22] rounded-full"></span>
                    <span className="animate-bounce [animation-delay:-0.15s] w-2 h-2 bg-[#f26e22] rounded-full"></span>
                    <span className="animate-bounce w-2 h-2 bg-[#f26e22] rounded-full"></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat active input container */}
          {isChatActive && (
            <div className="fixed bottom-0 left-16 sm:left-20 right-0 p-4 bg-gradient-to-t from-[#fcfcfc] via-[#fcfcfc]/90 to-transparent flex flex-col items-center">
              <SpeechTextInput
                question={question}
                setQuestion={setQuestion}
                askQuestion={() => askQuestion()}
                isChatActive={true}
              />
              <p className="text-gray-400 text-xs mt-2 font-medium">
                Jinny AI can make mistakes. Check important info.
              </p>
            </div>
          )}

          {/* Empty state footer */}
          {!isChatActive && (
            <div className="absolute bottom-6 w-full text-center">
              <p className="text-black/40 text-sm font-medium">
                Jinny AI can make mistakes. <span className="underline cursor-pointer">Check important info.</span>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
