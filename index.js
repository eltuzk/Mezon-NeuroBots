const dotenv = require("dotenv");
const { MezonClient } = require("mezon-sdk");

const handleExercise = require("./commands/exercise");
const handleGuide = require("./commands/guide");
const handleQuiz = require("./commands/quiz");
const handleSource = require("./commands/source");
const handleRemind = require("./commands/remind");
const handleDeleteReminder = require("./commands/delete_reminder");
const handleViewReminders = require("./commands/view_reminders");
const handleUsageGuide = require("./commands/usageGuide"); 

dotenv.config();

async function main() {
  const client = new MezonClient(process.env.APPLICATION_TOKEN);
  await client.login();
  
  /* GHI LOG MỌI TIN NHẮN ĐẾN ĐỂ PHÂN TÍCH */
  client.onChannelMessage((event) => {
    console.log("=== RAW EVENT START ===");
    console.dir(event, { depth: null });
    console.log("=== RAW EVENT END ===");
  });

  client.onChannelMessage(async (event) => {
    const text = event?.content?.t?.toLowerCase();
    if (!text) return;

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

main().then(() => console.log("🚀 Bot is running")).catch(console.error);
