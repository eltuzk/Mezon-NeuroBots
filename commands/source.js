// 📦 Import hàm gọi API Gemini
const { generateGeminiText } = require("../gemini");

// 👇 Export hàm xử lý lệnh *source
module.exports = async (client, event) => {
  try {
    // 🔍 Lấy nội dung tin nhắn gốc
    const text = event?.content?.t?.trim();

    // 📡 Lấy thông tin kênh và tin nhắn để phản hồi lại
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    // ✂️ Tách từng từ trong câu lệnh
    const parts = text.split(/\s+/);

    // ✅ Kiểm tra cú pháp: phải bắt đầu bằng *source và có ít nhất 1 đối số
    if (parts[0]?.toLowerCase() !== "*tai_lieu" || parts.length < 2) {
      return await message.reply({
        t: "📘 Cú pháp đúng: `*tai_lieu <môn học>`\nVí dụ: `*tai_lieu toán`"
      });
    }

    // 📌 Lấy phần còn lại làm tên môn học (có thể gồm nhiều từ)
    const subject = parts.slice(1).join(" ").trim();

    // ⚠️ Kiểm tra nếu môn học trống
    if (!subject) {
      return await message.reply({ t: "⚠️ Bạn chưa nhập tên môn học." });
    }

    // 🧠 Tạo prompt để yêu cầu Gemini gợi ý tài nguyên học tập
    const prompt = `
      Gợi ý 3 website hoặc video chất lượng giúp học tốt môn "${subject}" dành cho học sinh Việt Nam.
      Chỉ sử dụng các nguồn TÀI LIỆU TIẾNG VIỆT (hoặc có phụ đề tiếng Việt).
      Mỗi nguồn cần có mô tả ngắn (1-2 dòng) và ghi rõ đường link truy cập.
      Trình bày rõ ràng, dễ đọc, viết bằng tiếng Việt.
    `.trim();


    // 🚀 Gửi prompt đến Gemini để lấy nội dung
    const reply = await generateGeminiText(prompt);

    // 💬 Gửi kết quả trả về cho người dùng
    await message.reply({
      t: `🔗 **Tài nguyên học ${subject.toUpperCase()}**\n\n${reply}`
    });

  } catch (error) {
    // ❌ Log lỗi khi có vấn đề xảy ra trong quá trình xử lý chính
    console.error("❌ Lỗi ở *tai_lieu:", error);
    try {
      // 🔁 Thử gửi thông báo lỗi cho người dùng
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);
      await message.reply({
        t: "⚠️ Đã có lỗi xảy ra khi tìm tài nguyên học. Vui lòng thử lại sau."
      });
    } catch (err) {
      // ⚠️ Log lỗi nếu cả việc gửi thông báo lỗi cũng gặp sự cố
      console.error("⚠️ Lỗi khi gửi thông báo lỗi:", err);
    }
  }
};
