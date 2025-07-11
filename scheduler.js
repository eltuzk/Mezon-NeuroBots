const cron = require("node-cron");
const fs = require("fs");
const { MezonClient } = require("mezon-sdk");
require("dotenv").config();

const client = new MezonClient(process.env.APPLICATION_TOKEN);

// 👉 Đăng nhập Mezon
client.login().then(() => {
  console.log("🟢 Scheduler đang chạy...");

  // 🔁 Mỗi phút kiểm tra reminders
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"

    let reminders = [];
    try {
      const raw = fs.readFileSync("./reminders.json", "utf-8");
      reminders = JSON.parse(raw);
    } catch (e) {
      reminders = [];
    }

    const updatedReminders = [];

    for (const r of reminders) {
      if (r.time === currentTime) {
        try {
          const channel = await client.channels.fetch(r.channel_id);
          await channel.send({
            t: `🔔 Đến giờ học **${r.subject.toUpperCase()}** như bạn đã đặt lúc ${r.time}!`
          });
          console.log(`✅ Đã nhắc lịch: ${r.subject} - ${r.time}`);
          // ❌ Không thêm vào updatedReminders => nhắc xong thì xóa
        } catch (err) {
          console.error("⚠️ Gửi nhắc thất bại:", err);
          updatedReminders.push(r); // ❗ Gửi lỗi thì giữ lại
        }
      } else {
        updatedReminders.push(r); // ⏳ Chưa đến giờ thì giữ lại
      }
    }

    // ✍️ Ghi lại file reminders.json với danh sách mới
    try {
      fs.writeFileSync("./reminders.json", JSON.stringify(updatedReminders, null, 2));
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật reminders.json:", err);
    }
  });
});
