import ChatInput from "@/components/ChatInput";
import React from "react";

const ChatPage = () => {
  return (
    <div className="bg-[#212121] h-dvh w-svw flex justify-center">
      <div className="m-5 w-200 ">
        <ChatInput
          onSend={(message) => {
            console.log("Message sent:", message);
            // send to your LLM here
          }}
          isLoading={false}
        />
      </div>
    </div>
  );
};

export default ChatPage;
