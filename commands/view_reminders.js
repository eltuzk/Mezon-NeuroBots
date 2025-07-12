// 📘 Giới thiệu bot học tập
module.exports = async (client, event) => {
  try {
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    await message.reply({
      t: `
🤖 **GIỚI THIỆU BOT HỌC TẬP**

Dưới đây là các lệnh bạn có thể dùng:

1️⃣ **Đặt lịch học**  
\`*nhac_lich <môn học> <giờ> <ngày-tháng-năm>\`  
🕒 Ví dụ: \`*nhac_lich toán 19:30 13-07-2025\`

2️⃣ **Xóa lịch học**  
\`*xoa_lich <môn học> <giờ> <ngày-tháng-năm>\`  
🗑️ Ví dụ: \`*xoa_lich vật lý 20:00 13-07-2025\`

3️⃣ **Xem lịch học đã đặt**  
\`*xem_lich\`

4️⃣ **Tạo trắc nghiệm theo môn học**  
\`*trac_nghiem <tên môn>\`  
🧪 Ví dụ: \`*trac_nghiem sinh học\`

5️⃣ **Tìm tài liệu học tập**  
\`*tai_lieu <chủ đề>\`  
🔍 Ví dụ: \`*tai_lieu phương trình vi phân\`

6️⃣ **Hỏi AI**  
\`*hoi <câu hỏi bất kỳ>\`  
💬 Ví dụ: \`*hoi hệ điều hành là gì?\`

👉 Gõ \`*gioi_thieu_bot\` bất cứ lúc nào để xem lại hướng dẫn này nhé!
      `.trim()
    });

  } catch (err) {
    console.error("❌ Lỗi khi gửi giới thiệu bot:", err);
  }
};
