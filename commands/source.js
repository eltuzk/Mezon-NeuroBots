const boldify = require("../boldify");
// 📦 Import hàm gọi API Gemini
const { generateGeminiText } = require("../gemini");
const { updateStreak } = require("../streak");

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
    const cleaned = raw
      .replace(/\[(https?:\/\/[^\]]+)\]\s*\(\1\)/g, "$1") // xoá lặp link [x](x)
      .replace(/\n{3,}/g, "\n\n");                        // xoá 3+ dòng trắng → 2 dòng

    const formatted = cleaned
      .split(/\n(?=\d+\.\s)/)             // tách theo "1. ", "2. "…
      .map(entry =>
        entry
          .replace(/Mô tả\s*[:：]/i, "📌 Mô tả:")
          .replace(/Đường\s*link\s*[:：]/i, "🔗 Link:")
          .trim()
      )
      .join("\n\n");

    // 📤 Gửi lại (để boldify sinh mk)
    const title = `📚 **Tài nguyên học ${subject.toUpperCase()}**\n\n`;
    await message.reply(boldify(title + formatted));
    
    /* CẬP NHẬT STREAK và THÔNG BÁO 1 LẦN MỖI NGÀY */
    const userId = event.sender_id; // lấy id người dùng
    const { updated, streak } = updateStreak(userId); // chỉ lệnh đầu tiên trong ngày mới gửi
    if (updated) {                    
      const streakRaw = `🔥 **BẠN VỪA DUY TRÌ STREAK! Hiện tại: ${streak} ngày liên tiếp!**`;
      await message.reply(boldify(streakRaw));
    }
  } 
  catch (error) {
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
