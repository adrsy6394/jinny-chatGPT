import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Plus, Sparkles, Mic, MicOff, ArrowUp, Camera, Paperclip, X, FileText, Image as ImageIcon, SwitchCamera } from "lucide-react";

// ─── Camera Modal ──────────────────────────────────────────────────────────────
function CameraModal({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("user");
  const [error, setError] = useState("");

  const startCamera = async (mode) => {
    // Stop any existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError("");
    } catch (err) {
      setError("Camera access denied or not available. Please allow camera permission.");
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [facingMode]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" });
      onCapture(file);
    }, "image/jpeg", 0.92);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[#2f2f2f] rounded-3xl overflow-hidden shadow-2xl w-full max-w-lg border border-zinc-700">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <Camera className="w-5 h-5 text-orange-400" /> Camera
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Error */}
        <div className="relative bg-black" style={{ minHeight: "300px" }}>
          {error ? (
            <div className="flex items-center justify-center h-64 text-center px-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full object-cover"
              style={{ maxHeight: "400px" }}
            />
          )}
          <canvas ref={canvasRef} className="hidden" />

          {/* Flip Camera Button */}
          {!error && (
            <button
              onClick={() => setFacingMode(f => f === "user" ? "environment" : "user")}
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              title="Switch camera"
            >
              <SwitchCamera className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 px-5 py-5">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-400 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          {!error && (
            <button
              onClick={capturePhoto}
              className="px-8 py-2.5 rounded-full bg-[#f26e22] hover:bg-[#d95d18] text-white font-semibold text-sm transition-colors flex items-center gap-2 shadow-lg"
            >
              <Camera className="w-4 h-4" />
              Capture Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
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
  const popupRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
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

  const addFiles = (files) => {
    const newFiles = files.map(f => ({
      file: f,
      name: f.name,
      type: f.type,
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    addFiles(files);
    e.target.value = "";
  };

  const handleCameraCapture = (file) => {
    addFiles([file]);
    setShowCamera(false);
  };

  // Convert file to base64
  const fileToBase64 = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve({ data: reader.result.split(',')[1], type: file.type });
    reader.readAsDataURL(file);
  });

  // Handle sending with files
  const handleAskQuestion = async () => {
    const imageFiles = attachedFiles.filter(f => f.type.startsWith('image/'));
    let base64Images = [];
    if (imageFiles.length > 0) {
      base64Images = await Promise.all(imageFiles.map(f => fileToBase64(f.file)));
    }
    askQuestion(question || undefined, base64Images);
    setAttachedFiles([]);
  };

  const removeFile = (idx) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4 text-blue-400" />;
    return <FileText className="w-4 h-4 text-orange-400" />;
  };

  return (
    <>
      {/* Camera Modal */}
      {showCamera && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

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
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setShowCamera(true);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-zinc-600/60 transition-colors text-sm font-medium"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4 text-orange-400" />
                  </div>
                  <span>Camera</span>
                </button>

                <div className="h-px bg-zinc-600/50 mx-3" />

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

          {/* Hidden File Input */}
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
            onClick={handleAskQuestion}
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
    </>
  );
}

export default SpeechTextInput;
