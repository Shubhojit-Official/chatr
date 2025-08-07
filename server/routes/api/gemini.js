const express = require("express");
const router = express.Router();

const Gemini = require("@google/genai");
const GoogleGenAI = Gemini.GoogleGenAI;

const ai = new GoogleGenAI({});
router.get("/chat", async (req, res) => {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  const stream1 = await chat.sendMessageStream({
    message: "I have 2 dogs in my house.",
  });
  for await (const chunk of stream1) {
    console.log(chunk.text);
    console.log("_".repeat(80));
  }

  const stream2 = await chat.sendMessageStream({
    message: "How many dogs do I have again?",
  });
  for await (const chunk of stream2) {
    res.send(chunk);
    console.log(chunk.text);
    console.log("_".repeat(80));
  }
});

module.exports = router;
