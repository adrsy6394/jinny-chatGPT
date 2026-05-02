import React, { useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Plus, Sparkles, Mic, MicOff, ArrowUp } from "lucide-react";

function SpeechTextInput({ question, setQuestion, askQuestion, isChatActive }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
      adjustHeight();
    }
  }, [transcript, setQuestion]);

  // Reset height when input is cleared
  useEffect(() => {
    if (!question && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [question]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleInput = (e) => {
    setQuestion(e.target.value);
    adjustHeight();
  };

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
    <div className={`w-full max-w-3xl mx-auto transition-all duration-500 ${isChatActive ? 'mt-2 mb-2' : 'mt-8'}`}>
      <div className="bg-[#2f2f2f] rounded-[2rem] p-2 px-3 sm:px-4 flex items-end shadow-lg border border-zinc-700/50">
        
        {/* Left Plus Icon */}
        <button className="p-2 sm:p-2.5 text-zinc-400 hover:text-white transition-colors mb-0.5 shrink-0">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Auto-expanding Textarea */}
        <textarea
          ref={textareaRef}
          value={question}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask anything"
          className="flex-1 bg-transparent text-white placeholder-zinc-400 outline-none resize-none overflow-y-auto py-3 px-2 mx-1 sm:mx-2 text-base sm:text-lg scrollbar-hide max-h-48"
          style={{ minHeight: "48px" }}
        />

        {/* Right Icons */}
        <div className="flex items-center gap-1 sm:gap-2 mb-1 shrink-0">
          <button className="p-2 sm:p-2.5 text-blue-500 hover:bg-zinc-700/50 rounded-full transition-colors hidden sm:block">
            <Sparkles className="w-5 h-5" />
          </button>

          {browserSupportsSpeechRecognition && (
            <button
              onClick={handleMicClick}
              className={`p-2 sm:p-2.5 rounded-full transition-colors ${
                listening ? "bg-red-500 text-white animate-pulse" : "text-zinc-400 hover:bg-zinc-700/50 hover:text-white"
              }`}
              title={listening ? "Listening..." : "Click to speak"}
            >
              {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={askQuestion}
            disabled={!question.trim()}
            className={`p-2 sm:p-2.5 rounded-full transition-all ml-1 ${
              question.trim() ? "bg-[#f26e22] text-white hover:bg-[#d95d18]" : "bg-zinc-600/50 text-zinc-400 cursor-not-allowed"
            }`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default SpeechTextInput;
