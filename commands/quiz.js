const { generateGeminiText } = require("../gemini");

module.exports = async (client, event) => {
  const text = event?.content?.t?.toLowerCase();
  const channel = await client.channels.fetch(event.channel_id);
  const message = await channel.messages.fetch(event.message_id);

  const parts = text.split(" ");
  const subject = parts[1] || "math";

  const prompt = `Hãy tạo 3 câu hỏi trắc nghiệm có 4 lựa chọn về môn ${subject}. Đánh số và đánh dấu đáp án đúng.`;

  const reply = await generateGeminiText(prompt);

  await message.reply({ t: `📝 Quiz ${subject}:\n\n${reply}` });
};
