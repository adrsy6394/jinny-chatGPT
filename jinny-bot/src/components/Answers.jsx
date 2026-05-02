import React, { useEffect, useState, useRef } from "react";
import { chackHeading, replaceHeadingStars } from "./helper";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji"; // ✅ emoji plugin

function Answers({ ans, totalResult, index, type }) {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);
  const bottomRef = useRef(null);

  useEffect(() => {
    let finalAnswer = ans;

    if (chackHeading(ans)) {
      setHeading(true);
      finalAnswer = replaceHeadingStars(ans);
    } else {
      setHeading(false);
    }

    if (finalAnswer !== answer) {
      setAnswer(finalAnswer);
    }
  }, [ans]);

  useEffect(() => {
    if (type === "a") {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [answer, type]);

  const renderer = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          language={match[1]}
          style={dark}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code {...props} className={className}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="text-black dark:text-white whitespace-pre-line transition-none">
      {index === 0 && totalResult > 1 ? (
        <span className="pt-2 text-xl block">{answer}</span>
      ) : heading ? (
        <span className="pt-2 text-lg block">{answer}</span>
      ) : (
        <span className={type === "q" ? "pl-1" : "pl-5"}>
          <ReactMarkdown
            components={renderer}
            remarkPlugins={[remarkGfm, remarkEmoji]} // ✅ emoji plugin here
          >
            {answer}
          </ReactMarkdown>
        </span>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default React.memo(Answers);
