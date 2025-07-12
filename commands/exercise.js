const boldify = require("../boldify");
const { generateGeminiText } = require("../gemini");
const { updateStreak } = require("../streak");

module.exports = async (client, event) => {
  try {
    const text = event?.content?.t?.toLowerCase().trim();
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    const parts = text.split(/\s+/);
    const allowedCommands = ["*bài_tập", "*baitap", "*bai_tap", "*bài"];
    if (parts.length < 3 || !allowedCommands.includes(parts[0])) {
      return await message.reply({
        t: "📘 Cú pháp đúng: `*bai_tap <môn học> <chủ đề> [số bài]`\nVí dụ: `*bai_tap toán tích phân 3 bài`"
      });
    }

    // Danh sách các môn học
    const danhSachMonHoc = [
      "toán", "vật lí", "vật lý", "lý", "lí", "hóa", "hóa học", "sinh học", "sinh", "khoa học xã hội", "nghệ thuật", "Giáo dục kinh tế và pháp luật", "tiếng trung", "tiếng nga",
      "tiếng anh", "anh văn", "tiếng pháp", "địa lí", "địa lý", "địa", "lịch sử", "sử", "khoa học tự nhiên", "tin học", "tin", "công nghệ"
    ];

    const commandParts = parts.slice(1);
    let monHoc = null;
    let chuDeParts = [];

    for (let i = danhSachMonHoc.length - 1; i >= 0; i--) {
      const mon = danhSachMonHoc[i];
      const monParts = mon.split(" ");
      const joined = commandParts.slice(0, monParts.length).join(" ");
      if (joined === mon) {
        monHoc = mon;
        chuDeParts = commandParts.slice(monParts.length);
        break;
      }
    }

    if (!monHoc || chuDeParts.length === 0) {
      return await message.reply({
        t: "⚠️ Không xác định được môn học hoặc chủ đề. Hãy nhập theo cú pháp: `*bai_tap <môn học> <chủ đề> <số lượng> bài`"
      });
    }

    let chuDe = "";
    let soLuong = 5;

    const baiIndex = chuDeParts.findIndex((word, idx) =>
      word === "bài" && idx > 0 && !isNaN(chuDeParts[idx - 1])
    );

    if (baiIndex > 0) {
      soLuong = parseInt(chuDeParts[baiIndex - 1]);
      chuDe = chuDeParts.slice(0, baiIndex - 1).join(" ");
    } else {
      chuDe = chuDeParts.join(" ");
    }

    // Tạo prompt cho Gemini
    const prompt = `
      Viết ${soLuong} bài tập ngắn không có lời giải cho học sinh cấp 3, chỉ đưa ra bài tập dạng tự luận.
      Môn học: ${monHoc}
      Chủ đề: ${chuDe}
      Nếu Môn học là ngoại ngữ như là tiếng anh, tiếng pháp,... thì bài tập đưa ra là sử dụng ngôn ngữ của môn đó. 
      Trình bày bằng tiếng Việt rõ ràng, đánh số từ 1 đến ${soLuong}, nội dung ngắn gọn, dễ hiểu.
      Ưu tiên sử dụng số mũ Unicode như ², ³, ⁴... và đơn vị chuẩn (cm², m/s²...), viết thật đẹp, không dùng LaTeX, không dùng công thức ASCII.
    `.trim();
    
    // Gọi Gemini
    const reply = await generateGeminiText(prompt);

    const title = `📚 **${soLuong} bài tập - ${monHoc.toUpperCase()} | ${chuDe}**\n\n`;
    const fullText = title + reply;

    // Gửi kết quả chính
    await message.reply(boldify(fullText)); // ✅ dùng hàm boldify để phân tích **...** và in đậm

    // STREAK
    const userId = event.sender_id;
    const { updated, streak } = updateStreak(userId);
    if (updated) {
      const streakText = `🔥 **BẠN VỪA DUY TRÌ STREAK! Hiện tại: ${streak} ngày liên tiếp!**`;
      await message.reply(boldify(streakText));
    }
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
