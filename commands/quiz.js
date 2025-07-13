const boldify = require("../boldify"); // Định dạng in đậm
const { generateGeminiText } = require("../gemini"); // Gọi AI Gemini tạo nội dung
const { updateStreak } = require("../streak"); // Theo dõi streak học tập

// Xử lý lệnh *trac_nghiem
module.exports = async (client, event) => {
  console.dir(event, { depth: null }); // Log để debug nếu cần

  try {
    // Lấy nội dung tin nhắn và chuẩn hóa
    const text = event?.content?.t?.trim().toLowerCase();
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    const parts = text.split(/\s+/);

    // Kiểm tra cú pháp lệnh
    if (parts[0] !== "*trac_nghiem" || parts.length < 1) {
      return await message.reply({
        t: "📘 Cú pháp đúng: `*trac_nghiem <môn học> [số lượng]`\nVí dụ: `*trac_nghiem vật lý 5 bài`"
      });
    }

    // 👉 Phân tích môn học và số lượng câu hỏi từ lệnh
    let subject = "toán";
    let count = 3;

    if (parts.length >= 2) {
      const rawParams = parts.slice(1).join(" ");
      const match = rawParams.match(/^(.*?)(\d+)\s*(bài)?$/i);

      if (match) {
        subject = match[1].trim();
        count = parseInt(match[2]);
      } else {
        subject = rawParams.trim();
      }
    }

    // Tạo prompt gửi tới Gemini để sinh câu hỏi
    const prompt = `
      Tạo ${count} câu hỏi trắc nghiệm ngắn cho học sinh cấp 3 về môn "${subject}".
      Mỗi câu có 4 lựa chọn (A, B, C, D). Chỉ đánh dấu 1 đáp án đúng bằng ** như **C. Đáp án**.
      Trình bày bằng tiếng Việt, rõ ràng, dễ đọc, không dùng LaTeX hoặc ký hiệu khó hiểu.
    `.trim();

    const reply = await generateGeminiText(prompt);

    // 👉 Định dạng lại kết quả trả về từ Gemini
    const formattedBlocks = reply
      .split(/\n{2,}/)
      .map(block => {
        const matches = [...block.matchAll(/\*\*(.*?)\*\*/g)];
        let answer = null;

        for (const m of matches) {
          const content = m[1].trim();
          if (/^[A-D]\./.test(content)) {
            answer = content;
            break;
          }
        }

        const cleanedBlock = block.replace(/\*\*([A-D]\..*?)\*\*/g, "$1");

        return answer
          ? `${cleanedBlock.trimEnd()}\n**➡️ Đáp án đúng: ${answer}**`
          : cleanedBlock;
      });

    const formatted = formattedBlocks.join("\n\n");

    // Gửi nội dung trắc nghiệm về cho người dùng
    const title = `📝 **Trắc nghiệm ${subject.toUpperCase()} (${count} câu)**\n\n`;
    await message.reply(boldify(title + formatted));

    // 🔥 Cập nhật chuỗi streak nếu người dùng hoạt động hôm nay
    const userId = event.sender_id;
    const { updated, streak } = updateStreak(userId);
    if (updated) {
      const streakRaw = `🔥 **BẠN VỪA DUY TRÌ STREAK! Hiện tại: ${streak} ngày liên tiếp!**`;
      await message.reply(boldify(streakRaw));
    }
  } catch (error) {
    // Gửi thông báo lỗi nếu có sự cố
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
