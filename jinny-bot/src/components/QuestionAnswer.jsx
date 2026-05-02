import React from "react";
import Answers from "./Answers";
import { User, Sparkles } from "lucide-react";

function QuestionAnswer({ item, index }) {
  const isQuestion = item.type === "q";

  return (
    <div className={`flex w-full mb-6 ${isQuestion ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-2 sm:gap-4 max-w-full md:max-w-[85%] ${isQuestion ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className="shrink-0 mt-1">
          {isQuestion ? (
            <div className="w-8 h-8 rounded-full bg-[#f26e22] text-white flex items-center justify-center shadow-md">
              <User className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white text-[#f26e22] flex items-center justify-center shadow-md border border-gray-100">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`p-3 sm:p-4 shadow-sm text-sm sm:text-base whitespace-pre-line break-words flex-1 ${
            isQuestion
              ? "bg-[#f26e22] text-white rounded-2xl rounded-tr-sm font-medium"
              : "glass-panel text-gray-800 rounded-2xl rounded-tl-sm"
          }`}
        >
          {isQuestion ? (
            <Answers
              ans={item.text}
              totalResult={1}
              type={item.type}
              index={index}
            />
          ) : Array.isArray(item.text) ? (
            item.text.map((ansItem, ansIndex) => (
              <div key={`${index}-${ansIndex}`} className="mb-2 last:mb-0">
                <Answers
                  ans={ansItem}
                  totalResult={item.text.length}
                  type={item.type}
                  index={ansIndex}
                />
              </div>
            ))
          ) : (
            <Answers
              ans={item.text}
              totalResult={1}
              type={item.type}
              index={0}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default QuestionAnswer;
