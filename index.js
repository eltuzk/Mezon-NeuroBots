const dotenv = require("dotenv");
const { MezonClient } = require("mezon-sdk");

const handleExercise = require("./commands/exercise");
const handleGuide = require("./commands/guide");
const handleQuiz = require("./commands/quiz");
const handleSource = require("./commands/source");
const handleRemind = require("./commands/remind");

dotenv.config();

async function main() {
  const client = new MezonClient(process.env.APPLICATION_TOKEN);
  await client.login();
  
  client.onChannelMessage(async (event) => {
    const text = event?.content?.t?.toLowerCase();
    if (!text) return;

    if (text === "*ping") {
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);
      await message.reply({ t: "poooo!" });
      return;
    }

    if (text.startsWith("*bai_tap")) return handleExercise(client, event);
    if (text.startsWith("*huong_dan")) return handleGuide(client, event);
    if (text.startsWith("*trac_nghiem")) return handleQuiz(client, event);
    if (text.startsWith("*tai_lieu")) return handleSource(client, event);
    if (text.startsWith("*nhac_lich")) return handleRemind(client, event);
  });
}

main().then(() => console.log("🚀 Bot is running")).catch(console.error);
