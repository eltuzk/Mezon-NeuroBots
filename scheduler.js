const cron = require("node-cron");
const fs = require("fs");
const { MezonClient } = require("mezon-sdk");
require("dotenv").config();

const client = new MezonClient(process.env.APPLICATION_TOKEN);

client.login().then(() => {
  console.log("🟢 Scheduler is running...");

  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"

    // ✅ Chuyển sang định dạng DD-MM-YYYY
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const currentDate = `${year}-${month}-${day}`;

    let reminders = [];
    try {
      const raw = fs.readFileSync("./reminders.json", "utf-8");
      reminders = JSON.parse(raw);
    } catch (e) {}

    const updatedReminders = [];

    for (const r of reminders) {
      if (r.time === currentTime && r.date === currentDate) {
        try {
          const channel = await client.channels.fetch(r.channel_id);
          await channel.send({
            t: `🔔 Đến giờ học **${r.subject.toUpperCase()}** như bạn đã đặt lúc ${r.time}!`
          });
        } catch (err) {
          console.error("⚠️ Gửi nhắc thất bại:", err);
        }
        // Không thêm reminder đã nhắc nữa
      } else {
        updatedReminders.push(r);
      }
    }

    fs.writeFileSync("./reminders.json", JSON.stringify(updatedReminders, null, 2));
  });
});
