// 📦 Import hàm gọi API Gemini
const { generateGeminiText } = require("../gemini");

// 📤 Hàm xử lý lệnh *huong_dan
module.exports = async (client, event) => {
  try {
    const text = event?.content?.t?.trim();
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    // ✅ Kiểm tra cú pháp: phải bắt đầu bằng *huong_dan
    const parts = text.split(/\s+/);
    if (parts[0]?.toLowerCase() !== "*huong_dan" || parts.length < 2) {
      return await message.reply({
        t: "📘 Cú pháp đúng: `*huong_dan <đề bài>`\nVí dụ: `*huong_dan Tính đạo hàm của y = √(x² + 1)`"
      });
    }

    // ✂️ Lấy đề bài
    const deBai = parts.slice(1).join(" ").trim();
    if (!deBai) {
      return await message.reply({ t: "⚠️ Bạn chưa nhập đề bài cần giải." });
    }

    // 🧠 Prompt Gemini
    const prompt = `
      Bạn là một trợ lý học tập thông minh. Hãy giải chi tiết bài tập sau dành cho học sinh cấp 3:

      "${deBai}"

      Yêu cầu trình bày:
      - Giải thích rõ ràng, trình bày từng bước với gạch đầu dòng như "🔹 Bước 1:", "🔸 Bước 2:",...
      - Viết bằng tiếng Việt dễ hiểu, đúng chương trình THPT.
      - Không dùng LaTeX hay kí hiệu khó đọc.
      - Ưu tiên dùng số mũ như ², ³, ⁴ và đơn vị chuẩn (cm², m/s²,...).
    `.trim();

    const rawSolution = await generateGeminiText(prompt);

    // 🧽 Làm sạch format đầu ra
    const formatted = rawSolution
      .replace(/\*\*(.*?)\*\*/g, "$1")       // bỏ **đậm**
      .replace(/\*(.*?)\*/g, "$1")           // bỏ *nghiêng*
      .replace(/\[(https?:\/\/[^\]]+)\]\s*\((\1)\)/g, "$1") // xóa [link](link) lặp
      .replace(/\n{3,}/g, "\n\n")            // xóa thừa dòng

    // 📤 Gửi kết quả
    await message.reply({
      t: `🧠 **Hướng dẫn giải bài toán:**\n\n${formatted}`
    });

  } catch (error) {
    console.error("❌ Lỗi ở *huong_dan:", error);
    try {
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);
      await message.reply({
        t: "⚠️ Đã có lỗi xảy ra khi tạo hướng dẫn. Vui lòng thử lại sau."
      });
    } catch (err) {
      console.error("⚠️ Lỗi khi gửi thông báo lỗi:", err);
    }
  }
};
