import React, { useState, useRef, useEffect } from "react";
import { Square, ArrowUp, MicVocal, Loader } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";

const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (trimmed !== "") {
      onSend(trimmed);
      setMessage("");
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current; //Input Text Area
    if (textarea) {
      textarea.style.height = "inherit"; // Start fresh
      textarea.style.overflow = "hidden";
      textarea.style.height = `${textarea.scrollHeight}px`;

      // Limit height manually
      const maxHeight = 240; // or 15rem
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = "auto"; // enable scroll
      }
    }
  }, [message]);

  return (
    <div className="flex flex-col border border-[#444343] bg-[#303030] rounded-3xl">
      <textarea
        ref={textareaRef}
        rows={1}
        className="w-full min-h-12 max-h-[15rem] grow resize-none overflow-y-auto
                text-white text-sm focus:outline-none
                   scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
                   px-5 py-2"
        placeholder="Ask Gemni"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <div className="flex justify-center w-full my-1">
        <hr className="w-1/2" />
      </div>

      <div className="flex justify-end w-full flex-row p-2 gap-2">
        {/* Voice Recording Button */}
        <Tooltip title={isRecording ? "Stop Recording" : "Dictate"} arrow>
          <button
            onClick={() => {
              setIsRecording(!isRecording);
              console.log("Recording some shit");
            }}
            className="flex h-8 w-8 rounded-full justify-center items-center text-white hover:text-black hover:bg-[#5e5c5c] active:bg-[#d5dbd6] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRecording ? <Square className="text-red-500" /> : <MicVocal />}
          </button>
        </Tooltip>

        {/* Send Button */}
        <Tooltip title="Ask Gemini" arrow>
          <button
            onClick={() => {
              handleSend();
            }}
            disabled={isLoading}
            className="flex h-8 w-8 border border-white rounded-full justify-center items-center text-white hover:text-black hover:bg-white active:bg-[#d5dbd6] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <ArrowUp className="" />
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChatInput;
