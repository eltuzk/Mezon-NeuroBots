const { updateStreak } = require("../streak");
const fs = require("fs");

// 📤 Xử lý lệnh *nhac_lich
module.exports = async (client, event) => {
  try {
    const text = event?.content?.t?.toLowerCase().trim();

    // 📡 Lấy kênh và tin nhắn
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    const parts = text.split(/\s+/);

    // ✅ Kiểm tra lệnh có bắt đầu đúng không
    if (parts[0] !== "*nhac_lich" || parts.length < 3) {
      return await message.reply({
        t: "📘 Cú pháp đúng: `*nhac_lich <môn học> <giờ>`\nVí dụ: `*nhac_lich toán 20:00`"
      });
    }

    // ✂️ Trích tên môn và giờ
    const subject = parts.slice(1, parts.length - 1).join(" ");
    const time = parts[parts.length - 1];

    // ⏱ Kiểm tra định dạng giờ
    if (!/^\d{1,2}:\d{2}$/.test(time)) {
      return await message.reply({
        t: "⏰ Giờ không hợp lệ. Hãy nhập theo định dạng HH:mm (ví dụ: 19:30)"
      });
    }

    // 💾 Lưu vào reminders.json
    const reminder = {
      subject,
      time,
      channel_id: event.channel_id
    };

    let list = [];
    try {
      const raw = fs.readFileSync("./reminders.json", "utf-8");
      list = JSON.parse(raw);
    } catch (e) {}

    list.push(reminder);
    fs.writeFileSync("./reminders.json", JSON.stringify(list, null, 2));

    // 📢 Phản hồi xác nhận
    await message.reply({
      t: `⏰ Đã đặt lịch nhắc học **${subject.toUpperCase()}** vào **${time}**.\n👉 Bot sẽ tự nhắc đúng giờ nếu bạn đã bật cron.`
    });
    
    /* CẬP NHẬT STREAK và THÔNG BÁO 1 LẦN MỖI NGÀY */
    const userId = event.sender_id; // lấy id người dùng
    const { updated, streak } = updateStreak(userId); // chỉ lệnh đầu tiên trong ngày mới gửi
    if (updated) {                    
      await message.reply({
        t: `🔥 BẠN VỪA DUY TRÌ STREAK! Hiện tại: ${streak} ngày liên tiếp!`,
      });
    }
  } 
  catch (err) {
    console.error("❌ Lỗi khi xử lý *nhac_lich:", err);
    try {
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);
      await message.reply({
        t: "⚠️ Có lỗi xảy ra khi đặt lịch nhắc. Vui lòng thử lại sau."
      });
    } catch (e2) {
      console.error("⚠️ Lỗi khi gửi thông báo lỗi:", e2);
    }
  }
};
