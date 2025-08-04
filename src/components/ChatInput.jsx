import React, { useState, useRef, useEffect } from "react";
import { Square, ArrowUp, MicVocal, Loader } from "lucide-react";

const ChatInput = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
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
    <div className="min-h-12 w-full flex flex-col border border-[#444343] bg-[#303030] rounded-lg">
      <textarea
        ref={textareaRef}
        rows={1}
        className="w-full min-h-11 max-h-[15rem] grow resize-none overflow-y-auto
                text-white text-sm focus:outline-none
                   scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent
                   px-3 py-2"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            // handleSend(); // implement this
          }
        }}
      />

      <div className="flex justify-center w-full my-1">
        <hr className="w-1/2" />
      </div>

      <div className="flex justify-end w-full flex-row p-2 gap-2">
        {/* Voice Recording Button */}
        <button
          onClick={() => {
            setIsRecording(!isRecording);
            console.log("Recording some shit");
          }}
          className="flex h-10 w-10 rounded-full justify-center items-center text-white hover:text-black hover:bg-[#5e5c5c] active:bg-[#d5dbd6] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRecording ? <Square className="text-red-500" /> : <MicVocal />}
        </button>

        {/* Send Button */}
        <button
          onClick={() => {
            console.log("Sent some shit");
          }}
          disabled={isLoading}
          className="flex h-10 w-10 border border-white rounded-full justify-center items-center text-white hover:text-black hover:bg-white active:bg-[#d5dbd6] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <ArrowUp className="" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
