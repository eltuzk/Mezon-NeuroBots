const fs = require("fs");

// 📤 Xử lý lệnh *nhac_lich
module.exports = async (client, event) => {
  try {
    const text = event?.content?.t?.toLowerCase().trim();

    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    const parts = text.split(/\s+/);

    // ✅ Kiểm tra lệnh và số lượng tham số
    if (parts[0] !== "*nhac_lich" || parts.length < 4) {
      return await message.reply({
        t: "📘 Cú pháp đúng: `*nhac_lich <môn học> <giờ> <ngày-tháng-năm>`\nVí dụ: `*nhac_lich toán 19:30 12-07-2025`"
      });
    }

    const subject = parts.slice(1, parts.length - 2).join(" ");
    const time = parts[parts.length - 2];
    const rawDate = parts[parts.length - 1];

    // ⏱ Kiểm tra định dạng giờ và ngày
    const timeRegex = /^\d{1,2}:\d{2}$/;
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    if (!timeRegex.test(time) || !dateRegex.test(rawDate)) {
      return await message.reply({
        t: "⚠️ Sai định dạng.\nGiờ đúng: `HH:mm` (ví dụ: 19:30)\nNgày đúng: `dd-mm-yyyy` (ví dụ: 12-07-2025)"
      });
    }

    // 📅 Chuyển ngày về định dạng yyyy-mm-dd
    const [day, month, year] = rawDate.split("-");
    const isoDate = `${year}-${month}-${day}`;

    // 💾 Tạo đối tượng nhắc và lưu
    const reminder = {
      subject,
      time,
      date: isoDate,
      channel_id: event.channel_id
    };

    let list = [];
    try {
      const raw = fs.readFileSync("./reminders.json", "utf-8");
      list = JSON.parse(raw);
    } catch (e) {}

    list.push(reminder);
    fs.writeFileSync("./reminders.json", JSON.stringify(list, null, 2));

    // 📢 Chỉ phản hồi phần xác nhận đơn giản
    await message.reply({
      t: `⏰ Đã đặt lịch nhắc học **${subject.toUpperCase()}** vào **${time} ngày ${rawDate}**.`
    });

  } catch (err) {
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
