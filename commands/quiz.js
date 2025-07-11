// 📦 Import hàm gọi API Gemini
const { generateGeminiText } = require("../gemini");

// 📤 Hàm xử lý lệnh *trac_nghiem
module.exports = async (client, event) => {
  try {
    // 📨 Lấy nội dung tin nhắn và chuẩn hóa
    const text = event?.content?.t?.trim().toLowerCase();

    // 📡 Lấy channel và message để phản hồi
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    // ✂️ Tách từng phần của lệnh
    const parts = text.split(/\s+/);

    // ✅ Kiểm tra cú pháp: lệnh phải bắt đầu bằng *trac_nghiem
    if (parts[0] !== "*trac_nghiem" || parts.length < 1) {
      return await message.reply({
        t: "📘 Cú pháp đúng: `*trac_nghiem <môn học>`\nVí dụ: `*trac_nghiem hóa học`"
      });
    }

    // 📌 Lấy môn học (nếu có), mặc định là "toán"
    const subject = parts.length >= 2 ? parts.slice(1).join(" ") : "toán";

    // 🧠 Tạo prompt gửi đến Gemini để tạo câu hỏi trắc nghiệm
    const prompt = `
      Tạo 3 câu hỏi trắc nghiệm ngắn cho học sinh cấp 3 về môn "${subject}".
      Mỗi câu có 4 lựa chọn (A, B, C, D). Chỉ đánh dấu 1 đáp án đúng bằng ** như **C. Đáp án**.
      Trình bày bằng tiếng Việt, rõ ràng, dễ đọc, không dùng LaTeX hoặc ký hiệu khó hiểu.
    `.trim();

    // 🚀 Gửi prompt đến Gemini
    const reply = await generateGeminiText(prompt);

    // 🎨 Xử lý kết quả: tìm và gắn đáp án đúng hợp lệ
    const formatted = reply
      .split(/\n{2,}/) // tách từng câu hỏi
      .map(block => {
        // Tìm tất cả các đoạn được bọc **
        const matches = [...block.matchAll(/\*\*(.*?)\*\*/g)];
        let answerRaw = null;

        for (const match of matches) {
          const content = match[1].trim();
          // Chỉ lấy đáp án nếu bắt đầu bằng A. B. C. D.
          if (/^[A-D]\./.test(content)) {
            answerRaw = content;
            break;
          }
        }

        // Xóa toàn bộ dấu **
        const cleanBlock = block.replace(/\*\*(.*?)\*\*/g, "$1").trim();

        // Gắn dòng đáp án đúng nếu có
        return answerRaw
          ? `${cleanBlock}\n➡️ Đáp án đúng: ${answerRaw}`
          : cleanBlock;
      })
      .join("\n\n");

    // 💬 Trả kết quả cho người dùng
    await message.reply({
      t: `📝 **Trắc nghiệm ${subject.toUpperCase()}**\n\n${formatted}`
    });

  } catch (error) {
    // ❌ Bắt lỗi nếu có vấn đề
    console.error("❌ Lỗi ở *trac_nghiem:", error);
    try {
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);
      await message.reply({
        t: "⚠️ Đã có lỗi xảy ra khi tạo câu hỏi trắc nghiệm. Vui lòng thử lại sau."
      });
    } catch (err) {
      console.error("⚠️ Lỗi khi gửi thông báo lỗi:", err);
    }
  }
};
