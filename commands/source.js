// 📦 Import hàm gọi API Gemini
const { generateGeminiText } = require("../gemini");

// 📤 Hàm xử lý lệnh *tai_lieu
module.exports = async (client, event) => {
  try {
    const text = event?.content?.t?.trim();
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const parts = text.split(/\s+/);

    if (parts[0]?.toLowerCase() !== "*tai_lieu" || parts.length < 2) {
      return await message.reply({
        t: "📘 Cú pháp đúng: `*tai_lieu <môn học>`\nVí dụ: `*tai_lieu hóa học`"
      });
    }

    const subject = parts.slice(1).join(" ").trim();
    if (!subject) {
      return await message.reply({ t: "⚠️ Bạn chưa nhập tên môn học." });
    }

    // 🧠 Prompt Gemini
    const prompt = `
      Gợi ý 3 nguồn tài liệu chất lượng cao bằng tiếng Việt giúp học sinh Việt Nam học tốt môn "${subject}".
      Mỗi nguồn gồm:
      - Tên tài nguyên (ví dụ: "Toán Math – Chuyên mục Giải Tích")
      - Mô tả ngắn (~2-3 câu) dễ hiểu, phù hợp học sinh
      - Đường link gọn gàng, rõ ràng (chỉ hiển thị 1 lần)
      Trình bày không dùng ký hiệu ** hoặc * hoặc []().
    `.trim();

    const raw = await generateGeminiText(prompt);

    // ✨ Làm đẹp kết quả
    const formatted = raw
      .replace(/\*\*(.*?)\*\*/g, "$1")         // bỏ **...**
      .replace(/\*(.*?)\*/g, "$1")             // bỏ *...*
      .replace(/\[(https?:\/\/[^\]]+)\]\s*\((\1)\)/g, "$1") // xóa lặp link [x](x)
      .replace(/\n{3,}/g, "\n\n")              // xóa nhiều dòng trống liền nhau
      .split(/\n(?=\d+\.\s)/)                  // tách từng nguồn theo "1. ", "2. "...
      .map(entry => {
        // Làm đẹp từng mục
        return entry
          .replace(/Mô tả\s*[:：]/i, "📌 Mô tả:")
          .replace(/Đường\s*link\s*[:：]/i, "🔗 Link:")
          .trim();
      })
      .join("\n\n");

    // 📤 Gửi lại
    await message.reply({
      t: `📚 **Tài nguyên học ${subject.toUpperCase()}**\n\n${formatted}`
    });

  } catch (error) {
    console.error("❌ Lỗi ở *tai_lieu:", error);
    try {
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);
      await message.reply({
        t: "⚠️ Đã có lỗi xảy ra khi tìm tài liệu. Vui lòng thử lại sau."
      });
    } catch (err) {
      console.error("⚠️ Lỗi khi gửi thông báo lỗi:", err);
    }
  }
};
