const boldify = require("../boldify");
const fs = require("fs");
const { updateStreak } = require("../streak");

// 📤 Xử lý lệnh *xoa_lich
module.exports = async (client, event) => {
  try {
    const text = event?.content?.t?.toLowerCase().trim();
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    const parts = text.split(/\s+/);

    // ✅ Kiểm tra cú pháp lệnh
    if (parts[0] !== "*xoa_lich" || parts.length < 4) {
      return await message.reply({
        t: "📘 Cú pháp đúng: `*xoa_lich <môn học> <giờ> <ngày-tháng-năm>`\nVí dụ: `*xoa_lich toán 19:30 12-07-2025`"
      });
    }

    const subject = parts.slice(1, parts.length - 2).join(" ");
    const time = parts[parts.length - 2];
    let rawDate = parts[parts.length - 1].replace(/[–—−]/g, "-");

    const timeRegex = /^\d{1,2}:\d{2}$/;
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    if (!timeRegex.test(time) || !dateRegex.test(rawDate)) {
      return await message.reply({
        t: "⚠️ Định dạng sai.\n- Giờ đúng: `HH:mm` (vd: 19:30)\n- Ngày đúng: `dd-mm-yyyy` (vd: 12-07-2025)"
      });
    }

    const [dd, mm, yyyy] = rawDate.split("-");
    const isoDate = `${yyyy}-${mm}-${dd}`;

    let list = [];
    try {
      const raw = fs.readFileSync("./reminders.json", "utf-8");
      list = JSON.parse(raw);
    } catch (e) {}

    console.log("📥 Trước khi xóa:", list);

    const filtered = list.filter(r => !(
      r.subject.toLowerCase() === subject &&
      r.time === time &&
      r.date === isoDate &&
      r.channel_id === event.channel_id
    ));

    if (filtered.length === list.length) {
      return await message.reply(boldify(
        `⚠️ Không tìm thấy lịch nhắc **${subject.toUpperCase()}** lúc **${time} ngày ${rawDate}** để xóa.`
      ));
    }

    fs.writeFileSync("./reminders.json", JSON.stringify(filtered, null, 2));
    console.log("📤 Sau khi xóa:", filtered);

    await message.reply(boldify(
      `🗑️ Đã xóa lịch nhắc học **${subject.toUpperCase()}** vào **${time} ngày ${rawDate}** thành công.`
    ));

    const userId = event.sender_id;
    const { updated, streak } = updateStreak(userId);
    if (updated) {
      const streakRaw = `🔥 **BẠN VỪA DUY TRÌ STREAK! Hiện tại: ${streak} ngày liên tiếp!**`;
      await message.reply(boldify(streakRaw));
    }
  } catch (err) {
    console.error("❌ Lỗi khi xử lý *xoa_lich:", err);
    try {
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);
      await message.reply({
        t: "⚠️ Có lỗi khi xóa lịch nhắc. Vui lòng thử lại sau."
      });
    } catch (e2) {
      console.error("⚠️ Lỗi khi gửi thông báo lỗi:", e2);
    }
  }
};