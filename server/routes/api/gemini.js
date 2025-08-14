const express = require("express");
const router = express.Router();
const Gemini = require("@google/genai");
const { body, validationResult } = require("express-validator");
const GoogleGenAI = Gemini.GoogleGenAI;

const ChatSession = require("../../models/Chat.js");

const genAI = new GoogleGenAI({});

// In-memory cache: { sessionId: [ { role, text } ] }
const activeSessions = new Map();
const MAX_HISTORY = 5;

const chatHistories = router.post(
  "/chat",
  [
    body("userMessage").exists().withMessage("A Message is Required"),
    body("sessionId").exists().withMessage("Session Id is Required"),
  ],
  async (req, res) => {
    // Validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sessionId, userMessage, model = "gemini-2.5-flash" } = req.body;

    // [{role:["user", "model"], text: Text}]
    let history = activeSessions.get(sessionId);

    if (!history) {
      const dbSession = await ChatSession.findOne(
        { sessionId },
        { history: { $slice: -(MAX_HISTORY * 2) } } // fetch last few messages
      );

      if (dbSession) {
        history = dbSession.history.map((msg) => ({
          role: msg.role,
          text: msg.text,
        }));
      } else {
        history = [];
      }

      activeSessions.set(sessionId, history);
    }

    history.push({ role: "user", text: userMessage });

    // Prepare content for Gemini
    const contents = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    try {
      const stream = await genAI.models.generateContentStream({
        model,
        contents,
      });

      let aiResponse = "";

      for await (const chunk of stream) {
        if (chunk.text) {
          aiResponse += chunk.text;
          res.write(chunk.text);
        }
      }

      history.push({ role: "model", text: aiResponse });

      // Trim in-memory history (last N turns)
      if (history.length > MAX_HISTORY * 2) {
        history = history.slice(history.length - MAX_HISTORY * 2);
        activeSessions.set(sessionId, history);
      }

      await ChatSession.findOneAndUpdate(
        { sessionId },
        {
          $push: {
            history: {
              $each: [
                { role: "user", text: userMessage },
                { role: "model", text: aiResponse },
              ],
            },
          },
          $set: { updatedAt: new Date() },
        },
        { upsert: true }
      );

      res.end();
    } catch (error) {
      console.error("❌ Gemini Stream Error:", err);
      res.write(`\n[Error] ${err.message}`);
      res.end();
    }
  }
);

module.exports = router;
