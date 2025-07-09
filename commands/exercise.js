const { generateGeminiText } = require("../gemini");

module.exports = async (client, event) => {
  try {
    const text = event?.content?.t?.toLowerCase().trim();
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    const parts = text.split(/\s+/);
    const allowedCommands = ["*bài_tập", "*baitap", "*bai_tap", "*bài"];
    if (parts.length < 3 || !allowedCommands.includes(parts[0])) {
      return await message.reply({
        t: "📘 Cú pháp đúng: `*bài_tập <môn học> <chủ đề> [số bài]`\nVí dụ: `*bài_tập toán tích phân 3 bài`"
      });
    }

    const monHoc = parts[1];
    let chuDe = "";
    let soLuong = 5; // mặc định là 5 bài

    // Xử lý phần còn lại để lấy chủ đề và số bài (nếu có)
    const remaining = parts.slice(2); // sau <môn học>

    const baiIndex = remaining.findIndex((word, idx) =>
      word === "bài" && idx > 0 && !isNaN(remaining[idx - 1])
    );

    if (baiIndex > 0) {
      soLuong = parseInt(remaining[baiIndex - 1]);
      chuDe = remaining.slice(0, baiIndex - 1).join(" ");
    } else {
      chuDe = remaining.join(" ");
    }

    // Tạo prompt gửi đến Gemini
    const prompt = `
      Viết ${soLuong} bài tập ngắn không có lời giải cho học sinh cấp 3.
      Môn học: ${monHoc}
      Chủ đề: ${chuDe}
      Trình bày bằng tiếng Việt rõ ràng, đánh số từ 1 đến ${soLuong}, nội dung ngắn gọn, dễ hiểu.
      Ưu tiên sử dụng số mũ Unicode như ², ³, ⁴... và đơn vị chuẩn (cm², m/s²...), viết thật đẹp, không dùng LaTeX, không dùng công thức ASCII.
    `.trim();

    // Gọi Gemini
    const reply = await generateGeminiText(prompt);

    await message.reply({
      t: `📚 **${soLuong} bài tập - ${monHoc.toUpperCase()} | ${chuDe}**\n\n${reply}`
    });

  } catch (error) {
    console.error("❌ Lỗi ở *bài_tập:", error);
    try {
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);
      await message.reply({
        t: "⚠️ Đã có lỗi xảy ra khi tạo bài tập. Vui lòng thử lại sau."
      });
    } catch (err) {
      console.error("⚠️ Lỗi khi gửi thông báo lỗi:", err);
    }
  }
};
