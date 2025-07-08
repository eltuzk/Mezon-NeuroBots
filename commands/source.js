const { generateGeminiText } = require("../gemini");

module.exports = async (client, event) => {
  const text = event?.content?.t?.toLowerCase();
  const channel = await client.channels.fetch(event.channel_id);
  const message = await channel.messages.fetch(event.message_id);

  const parts = text.split(" ");
  const subject = parts[1] || "math";

  const prompt = `Gợi ý 3 website hoặc video giúp học tốt môn ${subject}. Ghi rõ link.`;

  const reply = await generateGeminiText(prompt);

  await message.reply({ t: `🔗 Tài nguyên học ${subject}:\n\n${reply}` });
};
