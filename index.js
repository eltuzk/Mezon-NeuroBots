const dotenv = require("dotenv");
const { MezonClient } = require("mezon-sdk");

// Import các lệnh xử lý tương ứng
const handleExercise = require("./commands/exercise");
const handleGuide = require("./commands/guide");
const handleQuiz = require("./commands/quiz");
const handleSource = require("./commands/source");
const handleRemind = require("./commands/remind");
const handleDeleteReminder = require("./commands/delete_reminder");
const handleViewReminders = require("./commands/view_reminders");
const handleUsageGuide = require("./commands/usageGuide");

dotenv.config(); // Kích hoạt biến môi trường

async function main() {
  const client = new MezonClient(process.env.APPLICATION_TOKEN); // Khởi tạo client bot với token từ .env
  await client.login();

  // Ghi log tất cả tin nhắn để debug
  client.onChannelMessage((event) => {
    console.log("=== RAW EVENT START ===");
    console.dir(event, { depth: null });
    console.log("=== RAW EVENT END ===");
  });

  // Xử lý nội dung tin nhắn
  client.onChannelMessage(async (event) => {
    const text = event?.content?.t?.toLowerCase(); // Lấy nội dung văn bản
    if (!text) return;

    // Gọi các hàm xử lý tương ứng với từng lệnh
    if (text.startsWith("*bai_tap")) return handleExercise(client, event);
    if (text.startsWith("*huong_dan")) return handleGuide(client, event);
    if (text.startsWith("*trac_nghiem")) return handleQuiz(client, event);
    if (text.startsWith("*tai_lieu")) return handleSource(client, event);
    if (text.startsWith("*nhac_lich")) return handleRemind(client, event);
    if (text.startsWith("*xoa_lich")) return handleDeleteReminder(client, event);
    if (text.startsWith("*xem_lich")) return handleViewReminders(client, event);
    if (text.startsWith("*gioi_thieu_bot")) return handleUsageGuide(client, event);
  });
}

main()
  .then(() => console.log("🚀 Bot is running"))
  .catch(console.error);