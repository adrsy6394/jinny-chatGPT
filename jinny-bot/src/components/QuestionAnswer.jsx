import React from "react";
import Answers from "./Answers";

function QuestionAnswer({ item, index }) {
  return (
    <div>
      <div className={item.type === "q" ? "flex justify-end" : ""}>
        {item.type === "q" ? (
          <li
            className="max-w-[80%] bg-blue-100 dark:bg-blue-600 text-black dark:text-white 
              p-3 rounded-2xl rounded-br-none shadow-sm text-sm sm:text-base 
              whitespace-pre-line break-words font-bold"
          >
            <Answers
              ans={item.text}
              totalResult={1}
              type={item.type}
              index={index}
            />
          </li>
        ) : Array.isArray(item.text) ? (
          item.text.map((ansItem, ansIndex) => (
            <li key={`${index}-${ansIndex}`} className="text-left p-1">
              <Answers
                ans={ansItem}
                totalResult={item.text.length}
                type={item.type}
                index={ansIndex}
              />
            </li>
          ))
        ) : (
          <li className="text-left p-1">
            <Answers
              ans={item.text}
              totalResult={1}
              type={item.type}
              index={0}
            />
          </li>
        )}
      </div>
    </div>
  );
}

export default QuestionAnswer;
