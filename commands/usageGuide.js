// 📘 Giới thiệu bot học tập
module.exports = async (client, event) => {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    await message.reply({
      t: `
🤖 **GIỚI THIỆU BOT HỌC TẬP – Hướng dẫn sử dụng**

Bạn có thể trò chuyện với bot bằng các lệnh đơn giản như sau:

---

📌 1. **Đặt lịch học**
\`*nhac_lich <môn học> <giờ> <ngày-tháng-năm>\`
📅 Để được nhắc học đúng giờ.  
Ví dụ: \`*nhac_lich toán 19:30 13-07-2025\`

---

❌ 2. **Xóa lịch học đã đặt**
\`*xoa_lich <môn học> <giờ> <ngày-tháng-năm>\`
🗑️ Dùng khi bạn muốn hủy nhắc học.  
Ví dụ: \`*xoa_lich vật lý 20:00 13-07-2025\`

---

👀 3. **Xem danh sách lịch học đã đặt**
\`*xem_lich\`
🗓️ Hiển thị các lịch nhắc hiện tại bạn đã tạo.

---

📚 4. **Tạo bài tập tự luận**
\`*bai_tap <môn học> <chủ đề> [số lượng bài]\`
✍️ Sinh các bài tập ngắn theo chủ đề bạn cần.  
Ví dụ: \`*bai_tap hóa học phản ứng oxi hóa khử 3 bài\`

---

🧠 5. **Giải thích chi tiết một bài toán**
\`*huong_dan <đề bài>\`
🔎 Nhận hướng dẫn từng bước để hiểu rõ cách làm bài.  
Ví dụ: \`*huong_dan Tính đạo hàm của y = √(x² + 1)\`

---

📝 6. **Tạo câu hỏi trắc nghiệm**
\`*trac_nghiem <môn học>\`
📋 Tạo 3 câu hỏi trắc nghiệm có đáp án đúng được gợi ý.  
Ví dụ: \`*trac_nghiem địa lý\`

---

📖 7. **Gợi ý tài liệu học tập**
\`*tai_lieu <môn học>\`
🔍 Nhận danh sách các nguồn học uy tín theo từng môn.  
Ví dụ: \`*tai_lieu lịch sử\`

---

🔥 8. **Duy trì streak học tập mỗi ngày**
- Khi bạn dùng các lệnh như \`*bai_tap\`, \`*huong_dan\`, \`*trac_nghiem\`, \`*tai_lieu\` mỗi ngày, bot sẽ tự động cập nhật **streak ngày học liên tiếp** và thông báo khi bạn giữ được chuỗi ngày đều đặn.

---

👉 Bạn có thể gõ \`*gioi_thieu_bot\` bất cứ lúc nào để xem lại hướng dẫn này.
      `.trim()
    });

  } catch (err) {
    console.error("❌ Lỗi khi gửi giới thiệu bot:", err);
  }
};
