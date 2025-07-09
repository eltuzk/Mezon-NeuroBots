const { generateGeminiText } = require("../gemini");

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

    // ✂️ Lấy đề bài bằng cách bỏ phần "*huong_dan"
    const deBai = parts.slice(1).join(" ").trim();

    if (!deBai) {
      return await message.reply({ t: "⚠️ Bạn chưa nhập đề bài cần giải." });
    }

    // 🧠 Prompt gửi đến Gemini
    const prompt = `
      Bạn là một trợ lý học tập thông minh. Hãy giải chi tiết bài tập sau dành cho học sinh cấp 3:
      ${deBai}
      Hướng dẫn giải cần rõ ràng, chia thành từng bước, trình bày bằng tiếng Việt, dễ hiểu, không quá dài, đúng chương trình trung học phổ thông.
      Ưu tiên sử dụng số mũ Unicode như ², ³, ⁴... và đơn vị chuẩn (cm², m/s²...), viết thật đẹp, không dùng LaTeX, không dùng công thức ASCII.
    `.trim();

    const solution = await generateGeminiText(prompt);

    await message.reply({
      t: `🧠 **Hướng dẫn giải:**\n\n${solution}`
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
