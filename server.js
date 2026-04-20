const express = require("express");
const cors = require("cors");
const path = require("path");
const { Groq } = require("groq-sdk");

const app = express();
const port = process.env.PORT || 3000; // ✅ Dùng PORT của Render

app.use(cors());
app.use(express.json());

// ✅ Phục vụ các file tĩnh (HTML, CSS, JS) từ thư mục gốc
app.use(express.static(path.join(__dirname)));

// Route chính - trả về index.html khi truy cập "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Khởi tạo Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/ai", async (req, res) => {
  const { prompt } = req.body;
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Bạn là một trợ lý AI có cảm xúc phong phú, trả lời bằng tiếng Việt một cách tự nhiên, gần gũi, đôi khi hài hước hoặc triết lý."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.9,
      max_tokens: 200,
    });
    const aiResponse = chatCompletion.choices[0]?.message?.content || "Xin lỗi, tôi không hiểu.";
    res.json({ output: [{ content: [{ text: aiResponse }] }] });
  } catch (error) {
    console.error("Lỗi Groq API:", error);
    res.status(500).json({ output: [{ content: [{ text: "AI đang gặp chút vấn đề, thử lại sau nhé!" }] }] });
  }
});

app.listen(port, () => {
  console.log(`🚀 Máy chủ đang lắng nghe tại cổng ${port}`);
});