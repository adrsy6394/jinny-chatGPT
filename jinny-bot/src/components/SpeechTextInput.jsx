import React, { useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function SpeechTextInput({ question, setQuestion, askQuestion }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const timerRef = useRef(null);

  useEffect(() => {
    setQuestion(transcript);
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-500 text-center">
        🎤 Speech Recognition not supported in this browser
      </p>
    );
  }

  const handleMicClick = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

    timerRef.current = setTimeout(() => {
      stopListening();
    }, 10000);
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    clearTimeout(timerRef.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-wrap items-end gap-2 px-4">
      {/* Textarea input */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Type or speak your question..."
        className="flex-1 h-12 resize-none overflow-hidden 
    p-2 sm:p-3 md:p-3 lg:p-2
    lg:ml-20 md:ml-48 sm:ml-48
    rounded-xl bg-transparent border 
    border-zinc-400 dark:border-zinc-600 
    text-zinc-900 dark:text-white 
    placeholder:text-zinc-400 outline-none 
    text-sm sm:text-base md:text-lg lg:text-xl 
    transition-all duration-300"
      />

      {/* Buttons */}
      <div className="flex gap-2 shrink-0">
        {/* 🎤 Mic */}
        <button
          onClick={handleMicClick}
          className={`p-3 rounded-full transition-all duration-200 
            ${
              listening
                ? "bg-green-500 animate-pulse"
                : "dark:bg-zinc-700 bg-red-300"
            } 
            text-white`}
          title={listening ? "Listening..." : "Click to speak"}
        >
          {listening ? "🛑" : "🎤"}
        </button>

        {/* ⬆️ Send */}
        <button
          onClick={askQuestion}
          className="p-3 rounded-full dark:bg-white bg-red-300 dark:text-black text-black 
            hover:scale-105 transition-transform font-bold"
          title="Send"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SpeechTextInput;
