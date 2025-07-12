const cron = require("node-cron"); // Dùng để tạo tác vụ định kỳ (cron job)
const fs = require("fs"); // Đọc và ghi file
const { MezonClient } = require("mezon-sdk"); // SDK để kết nối với Mezon
require("dotenv").config(); // Tải biến môi trường từ .env

// Khởi tạo bot client với token
const client = new MezonClient(process.env.APPLICATION_TOKEN);

client.login().then(() => {
  console.log("🟢 Scheduler is running...");

  // Cron job chạy mỗi phút
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:mm"

    // Format ngày hiện tại theo "yyyy-mm-dd"
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const currentDate = `${year}-${month}-${day}`;

    // Đọc danh sách nhắc lịch từ file JSON
    let reminders = [];
    try {
      const raw = fs.readFileSync("./reminders.json", "utf-8");
      reminders = JSON.parse(raw);
    } catch (e) {} // Nếu lỗi (ví dụ chưa có file) thì bỏ qua

    const updatedReminders = [];

    // Kiểm tra từng lịch hẹn
    for (const r of reminders) {
      if (r.time === currentTime && r.date === currentDate) {
        // Nếu đến giờ, gửi tin nhắn nhắc học
        try {
          const channel = await client.channels.fetch(r.channel_id);
          await channel.send({
            t: `🔔 Đến giờ học **${r.subject.toUpperCase()}** như bạn đã đặt lúc ${r.time}!`
          });
        } catch (err) {
          console.error("⚠️ Gửi nhắc thất bại:", err);
        }
        // Không lưu lại reminder đã gửi
      } else {
        updatedReminders.push(r); // Giữ lại các lịch chưa đến giờ
      }
    }

    // Cập nhật lại file reminders
    fs.writeFileSync("./reminders.json", JSON.stringify(updatedReminders, null, 2));
  });
});
