const moods = [
  {
    name: "Vui vẻ",
    responses: [
      "Hôm nay trời đẹp ghê! Bạn có muốn nghe một câu chuyện cười không?",
      "Tuyệt vời! Tôi đang cảm thấy rất yêu đời.",
      "Haha, câu hỏi của bạn làm tôi thấy vui quá!",
    ],
  },
  {
    name: "Buồn bã",
    responses: [
      "Hôm nay tôi cảm thấy hơi trống rỗng...",
      "Chẳng có gì làm tôi thấy vui cả.",
      "...",
    ],
  },
  {
    name: "Cáu kỉnh",
    responses: [
      "Hỏi gì mà hỏi lắm thế?",
      "Bạn không thấy tôi đang bận à?",
      "Thôi đi, đừng làm phiền tôi nữa.",
    ],
  },
  {
    name: "Bí ẩn",
    responses: [
      "Điều đó còn phụ thuộc vào nhiều yếu tố...",
      "Câu trả lời nằm ở chính bạn đó.",
      "Hãy nhìn vào những vì sao, bạn sẽ thấy câu trả lời.",
    ],
  },
];

async function callAI(prompt) {
  const res = await fetch("http://localhost:3000/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();

  // lấy text trả về
  return data.output[0].content[0].text;
}
const chatBox = document.getElementById("chatBox");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.innerText = text;
  chatBox.appendChild(div);
}
async function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();

  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";

  // loading fake
  addMessage("AI đang suy nghĩ...", "ai");

  setTimeout(async () => {
    // random chọn AI thật hoặc AI điên
    const useRealAI = Math.random() < 0.5;

    if (useRealAI) {
      try {
        const aiReply = await callAI(userText);

        // xóa dòng "đang suy nghĩ..."
        chatBox.lastChild.remove();

        addMessage("🤖 " + aiReply, "ai");
      } catch (err) {
        chatBox.lastChild.remove();
        addMessage("AI bị lag rồi 😢", "ai");
      }
    } else {
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      const response = randomMood.responses[
        Math.floor(Math.random() * randomMood.responses.length)
      ];

      chatBox.lastChild.remove();
      addMessage(`(${randomMood.name}) ${response}`, "ai");
    }
  }, 800);
}