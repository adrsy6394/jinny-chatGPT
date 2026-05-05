import React, { useEffect, useState, useRef } from "react";
import { chackHeading, replaceHeadingStars } from "./helper";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji"; // ✅ emoji plugin
import { Copy, Check } from "lucide-react";

const CodeBlock = ({ language, children }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-[#0d0d0d] ring-1 ring-white/10">
      <div className="flex items-center justify-between px-5 py-3 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-[10px] font-bold font-mono text-white/40 uppercase tracking-[0.1em]">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-medium text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="relative group">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          PreTag="div"
          customStyle={{
            padding: "1.5rem",
            margin: 0,
            background: "transparent",
            fontSize: "0.85rem",
            lineHeight: "1.7",
            overflowX: "auto",
          }}
          codeTagProps={{
            style: {
              fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
              background: "transparent",
            }
          }}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

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
      const language = match ? match[1] : "";
      
      return !inline && match ? (
        <CodeBlock language={language}>
          {String(children).replace(/\n$/, "")}
        </CodeBlock>
      ) : (
        <code {...props} className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-[#f26e22] dark:text-[#ff8c4a]">
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
