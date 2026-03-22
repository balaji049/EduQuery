import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function StructuredMessage({ content }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{

          // H2 (## Summary, etc.)
          h2: ({ children }) => (
            <h2 className="text-[#1D546D] font-semibold text-base mt-3 mb-1">
              {children}
            </h2>
          ),

          // H3
          h3: ({ children }) => (
            <h3 className="text-[#1D546D] font-medium mt-2">
              {children}
            </h3>
          ),

          // Paragraph
          p: ({ children }) => (
            <p className="text-[#061E29] leading-relaxed">
              {children}
            </p>
          ),

          // Bullet list
          li: ({ children }) => (
            <li className="ml-5 list-disc text-[#061E29]">
              {children}
            </li>
          ),

          // Strong text
          strong: ({ children }) => (
            <span className="font-semibold text-[#061E29]">
              {children}
            </span>
          ),

          // Inline code
          code({ inline, children }) {
            return inline ? (
              <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">
                {children}
              </code>
            ) : (
              <pre className="bg-[#0B2A3B] text-white p-3 rounded-lg overflow-x-auto text-xs mt-2">
                <code>{children}</code>
              </pre>
            );
          },

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#1D546D] pl-3 italic text-gray-600">
              {children}
            </blockquote>
          ),

        }}
      >
        {content}
      </ReactMarkdown>

    </div>
  );
}