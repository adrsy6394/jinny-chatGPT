import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Plus, Sparkles, Mic, MicOff, ArrowUp, Camera, Paperclip, X, FileText, Image } from "lucide-react";

function SpeechTextInput({ question, setQuestion, askQuestion, isChatActive }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const timerRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const popupRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
      adjustHeight();
    }
  }, [transcript, setQuestion]);

  useEffect(() => {
    if (!question && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [question]);

  // Close popup on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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
    if (listening) stopListening();
    else startListening();
  };

  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    timerRef.current = setTimeout(() => stopListening(), 10000);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newFiles = files.map(f => ({
      file: f,
      name: f.name,
      type: f.type,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
    setShowPopup(false);
    e.target.value = "";
  };

  const removeFile = (idx) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <Image className="w-4 h-4 text-blue-400" />;
    return <FileText className="w-4 h-4 text-orange-400" />;
  };

  return (
    <div className={`w-full max-w-3xl mx-auto transition-all duration-500 ${isChatActive ? 'mt-2 mb-2' : 'mt-8'}`}>

      {/* Attached Files Preview */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {attachedFiles.map((f, idx) => (
            <div key={idx} className="relative flex items-center gap-2 bg-zinc-700 rounded-xl px-3 py-2 max-w-[200px]">
              {f.preview ? (
                <img src={f.preview} alt={f.name} className="w-8 h-8 object-cover rounded-lg shrink-0" />
              ) : (
                getFileIcon(f.type)
              )}
              <span className="text-white text-xs truncate max-w-[100px]">{f.name}</span>
              <button
                onClick={() => removeFile(idx)}
                className="ml-1 text-zinc-400 hover:text-white transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#2f2f2f] rounded-[2rem] p-2 px-3 sm:px-4 flex items-end shadow-lg border border-zinc-700/50 relative">

        {/* Plus Button with Popup */}
        <div className="relative shrink-0" ref={popupRef}>
          <button
            onClick={() => setShowPopup(prev => !prev)}
            className={`p-2 sm:p-2.5 transition-colors mb-0.5 rounded-full ${showPopup ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <Plus className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${showPopup ? 'rotate-45' : ''}`} />
          </button>

          {/* Popup Menu */}
          {showPopup && (
            <div className="absolute bottom-14 left-0 bg-[#3a3a3a] border border-zinc-600 rounded-2xl shadow-2xl overflow-hidden z-50 w-52">
              {/* Camera Option */}
              <button
                onClick={() => {
                  setShowPopup(false);
                  cameraInputRef.current?.click();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-zinc-600/60 transition-colors text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-orange-400" />
                </div>
                <span>Camera</span>
              </button>

              <div className="h-px bg-zinc-600/50 mx-3" />

              {/* Add File & Media Option */}
              <button
                onClick={() => {
                  setShowPopup(false);
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-zinc-600/60 transition-colors text-sm font-medium"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Paperclip className="w-4 h-4 text-blue-400" />
                </div>
                <span>Add File & Media</span>
              </button>
            </div>
          )}
        </div>

        {/* Hidden Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

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
            disabled={!question.trim() && attachedFiles.length === 0}
            className={`p-2 sm:p-2.5 rounded-full transition-all ml-1 ${
              question.trim() || attachedFiles.length > 0 ? "bg-[#f26e22] text-white hover:bg-[#d95d18]" : "bg-zinc-600/50 text-zinc-400 cursor-not-allowed"
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
