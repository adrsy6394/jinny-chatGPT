import React, { useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Plus, SlidersHorizontal, Paperclip, Mic, MicOff, ArrowUp } from "lucide-react";

function SpeechTextInput({ question, setQuestion, askQuestion, isChatActive }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const timerRef = useRef(null);

  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
    }
  }, [transcript, setQuestion]);

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
    <div className={`w-full max-w-4xl mx-auto transition-all duration-500 ${isChatActive ? 'mt-4 mb-4' : 'mt-12'}`}>
      <div className="glass-panel rounded-3xl p-4 sm:p-6 flex flex-col gap-4 shadow-xl">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={isChatActive ? 2 : 4}
          placeholder="Ask Me Anything..."
          className="w-full resize-none bg-transparent text-gray-800 placeholder:text-gray-500/80 outline-none text-lg sm:text-xl font-medium scrollbar-hide"
        />

        <div className="flex items-center justify-between mt-2">
          {/* Left Icons */}
          <div className="flex items-center gap-3">
            <button className="p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-colors text-gray-700">
              <Plus className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-colors text-gray-700">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button className="p-2 bg-white/20 hover:bg-white/40 rounded-xl transition-colors text-gray-700 hidden sm:block">
              <Paperclip className="w-5 h-5" />
            </button>

            {browserSupportsSpeechRecognition && (
              <button
                onClick={handleMicClick}
                className={`p-2 rounded-xl transition-colors ${
                  listening ? "bg-red-500 text-white animate-pulse" : "bg-white/20 hover:bg-white/40 text-gray-700"
                }`}
                title={listening ? "Listening..." : "Click to speak"}
              >
                {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={askQuestion}
              disabled={!question.trim()}
              className={`p-2 rounded-xl transition-all ${
                question.trim() ? "bg-[#f26e22] hover:bg-[#d95d18] text-white" : "bg-white/20 text-gray-400 cursor-not-allowed"
              }`}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpeechTextInput;
