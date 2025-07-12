const boldify = require("../boldify");
// 📦 Import hàm gọi API Gemini
const { generateGeminiText } = require("../gemini");
const { updateStreak } = require("../streak");

// 📤 Hàm xử lý lệnh *trac_nghiem
module.exports = async (client, event) => {
  console.dir(event, { depth: null });

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

    // Xử lý kết quả: tìm và gắn đáp án đúng hợp lệ
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

    // 💬 Trả kết quả cho người dùng (để boldify lo phần **đậm**)
    const title = `📝 **Trắc nghiệm ${subject.toUpperCase()}**\n\n`;
    await message.reply(boldify(title + formatted));
    
    /* CẬP NHẬT STREAK và THÔNG BÁO 1 LẦN MỖI NGÀY */
    const userId = event.sender_id; // lấy id người dùng
    const { updated, streak } = updateStreak(userId); // chỉ lệnh đầu tiên trong ngày mới gửi
    if (updated) {                    
      const streakRaw = `🔥 **BẠN VỪA DUY TRÌ STREAK! Hiện tại: ${streak} ngày liên tiếp!**`;
      await message.reply(boldify(streakRaw));   // 👈 dùng hàm boldify
    }
  } 
  catch (error) {
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
