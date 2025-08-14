import React, { useState, useRef, useEffect } from "react";
import ChatInput from "@/components/ChatInput";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatPage = () => {
  const [messages, setMessages] = useState([]); // { role: 'user' | 'model', text: string }
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (message) => {
    if (!message.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setIsLoading(true);

    try {
      // Example fetch — replace URL with your API route
      const res = await fetch("http://localhost:6969/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "12345", // replace with actual session ID logic
          userMessage: message,
        }),
      });

      // Read streamed response
      const reader = res.body.getReader();
      let aiText = "";
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
      }

      // Add AI reply
      setMessages((prev) => [...prev, { role: "model", text: aiText }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "[Error receiving response]" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#212121] h-dvh w-svw flex flex-col items-center">
      <div className="flex flex-col flex-grow w-full max-w-6xl p-5 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-600 self-end text-white"
                : "bg-gray-700 self-start text-white"
            }`}
          >
            <ReactMarkdown
              children={msg.text}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code
                      className="bg-gray-800 px-1 py-0.5 rounded"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="w-full max-w-2xl p-5">
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatPage;
