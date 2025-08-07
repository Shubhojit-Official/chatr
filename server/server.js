const express = require("express");
const connectDb = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API Running"));
connectDb();
// Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/gemini", require("./routes/api/gemini"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
