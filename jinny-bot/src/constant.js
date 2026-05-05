const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const URL = isLocal 
  ? "http://localhost:5000/api/chat" 
  : "https://jinny-chat-gpt.vercel.app/api/chat";

