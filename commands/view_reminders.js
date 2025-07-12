const fs = require("fs");

// 📤 Xử lý lệnh *xem_lich
module.exports = async (client, event) => {
  try {
    const text = event?.content?.t?.toLowerCase().trim();

    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    // 📂 Đọc reminders
    let list = [];
    try {
      const raw = fs.readFileSync("./reminders.json", "utf-8");
      list = JSON.parse(raw);
    } catch (e) {}

    const myReminders = list.filter(r => r.channel_id === event.channel_id);

    if (myReminders.length === 0) {
      return await message.reply({ t: "📭 Bạn chưa có lịch nhắc nào." });
    }

    // ✅ Nhóm theo ngày
    const grouped = {};
    for (const r of myReminders) {
      if (!grouped[r.date]) grouped[r.date] = [];
      grouped[r.date].push(r);
    }

    // 🗂 Sắp xếp theo ngày và giờ
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
    let result = "📅 Danh sách lịch nhắc:\n";

    for (const date of sortedDates) {
      const formattedDate = formatDate(date);
      result += `\n📆 Ngày ${formattedDate}:\n`;

      // sắp theo giờ trong ngày
      grouped[date].sort((a, b) => {
        const [h1, m1] = a.time.split(":").map(Number);
        const [h2, m2] = b.time.split(":").map(Number);
        return h1 !== h2 ? h1 - h2 : m1 - m2;
      });

      grouped[date].forEach((r, i) => {
        result += `🔹 ${i + 1}. ${r.subject.toUpperCase()} – lúc ${r.time}\n`;
      });
    }

    await message.reply({ t: result });

  } catch (err) {
    console.error("❌ Lỗi khi xử lý *xem_lich:", err);
    try {
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);
      await message.reply({ t: "⚠️ Có lỗi khi xem lịch. Vui lòng thử lại sau." });
    } catch (e2) {
      console.error("⚠️ Lỗi khi gửi thông báo lỗi:", e2);
    }
  }
};

// 🔧 Chuyển yyyy-mm-dd => dd-mm-yyyy
function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

