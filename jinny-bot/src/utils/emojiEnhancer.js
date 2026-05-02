// utils/emojiEnhancer.js
export function addEmojisToAnswer(text) {
const emojiMap = [
  { keywords: ["great", "awesome", "well done", "nice", "shandar", "badhiya"], emoji: "👏" },
  { keywords: ["react", "javascript", "web", "html", "css", "frontend", "backend"], emoji: "💻" },
  { keywords: ["error", "issue", "problem", "bug", "galti"], emoji: "⚠️" },
  { keywords: ["success", "completed", "done", "achieved", "kaam ho gaya", "safalta"], emoji: "✅" },
  { keywords: ["fast", "speed", "quick", "performance", "tez", "turant"], emoji: "⚡" },
  { keywords: ["ai", "chatbot", "openai", "machine learning", "buddhi", "artificial"], emoji: "🤖" },
  { keywords: ["thank", "thanks", "thank you", "dhanyavaad", "shukriya"], emoji: "🙏" },
  { keywords: ["tip", "suggestion", "idea", "recommend", "raay", "salah"], emoji: "💡" },
  { keywords: ["new", "feature", "launch", "naya", "update aaya"], emoji: "🆕" },
  { keywords: ["important", "note", "highlight", "jaruri", "dhyan dein"], emoji: "📝" },
  { keywords: ["love", "like", "enjoy", "pyar", "pasand"], emoji: "❤️" },
  { keywords: ["warning", "caution", "alert", "sachet", "khatra"], emoji: "🚨" },
  { keywords: ["code", "program", "script", "developer", "logic"], emoji: "🧑‍💻" },
  { keywords: ["update", "upgrade", "version", "release"], emoji: "🔄" },
  { keywords: ["secure", "safe", "protection", "security", "suraksha"], emoji: "🔒" },
  { keywords: ["test", "debug", "check", "verify"], emoji: "🔍" },
  { keywords: ["database", "sql", "mongo", "data", "store"], emoji: "🗃️" },
  { keywords: ["design", "ui", "ux", "figma", "interface"], emoji: "🎨" },
  { keywords: ["mobile", "android", "ios", "app", "phone"], emoji: "📱" },
  { keywords: ["upload", "download", "share", "bhejna", "send"], emoji: "📤" },
  { keywords: ["time", "schedule", "late", "jaldi", "calendar"], emoji: "⏰" },
  { keywords: ["learning", "study", "padhna", "sikhna", "course", "tutorial"], emoji: "📚" },
  { keywords: ["goal", "target", "lakshya", "focus"], emoji: "🎯" },
  { keywords: ["music", "sound", "audio", "gaana"], emoji: "🎵" },
  { keywords: ["video", "watch", "dekhna", "yt", "youtube"], emoji: "🎬" },
  { keywords: ["money", "payment", "price", "upi", "paise", "amount"], emoji: "💰" },
  { keywords: ["celebrate", "congrats", "mubarak", "badhai", "celebration"], emoji: "🎉" },
  { keywords: ["health", "fit", "doctor", "hospital", "test"], emoji: "🏥" },
  { keywords: ["location", "map", "address", "location kaha hai"], emoji: "📍" },
  { keywords: ["question", "query", "sawal", "prashn"], emoji: "❓" }
];



  let enhanced = text;

  emojiMap.forEach(({ keywords, emoji }) => {
    keywords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      if (regex.test(enhanced)) {
        enhanced = enhanced.replace(regex, `${word} ${emoji}`);
      }
    });
  });

  return enhanced;
}
