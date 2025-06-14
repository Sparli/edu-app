// src/app/components/MathText.tsx
"use client";

import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface Props {
  /** Text that may contain inline or display LaTeX */
  content: string;
}

/**
 * Split plain-text into alternating “text” and “math” tokens.
 * Supported delimiters:
 *   • \( ... \)   – inline
 *   • $ ... $     – inline
 *   • \[ ... \]   – display
 *   • $$ ... $$   – display
 */
export default function MathText({ content }: Props) {
  const tokenRegex =
    /(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$\$[\s\S]+?\$\$|\$[^\$]+\$)/g;

  const parts = content.split(tokenRegex);

  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null; // skip empty strings from split

        const isInlineParen = part.startsWith("\\(") && part.endsWith("\\)");
        const isInlineDollar = part.startsWith("$") && part.endsWith("$");
        const isDisplayBracket = part.startsWith("\\[") && part.endsWith("\\]");
        const isDisplayDollar = part.startsWith("$$") && part.endsWith("$$");

        if (isInlineParen || isInlineDollar) {
          const cleaned = part.slice(isInlineParen ? 2 : 1, -2);
          return <InlineMath key={idx} math={cleaned.trim()} />;
        }

        if (isDisplayBracket || isDisplayDollar) {
          const cleaned = part.slice(isDisplayBracket ? 2 : 2, -2);
          return <BlockMath key={idx} math={cleaned.trim()} />;
        }

        // plain text
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}
