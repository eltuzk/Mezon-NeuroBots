const { generateGeminiText } = require("../gemini");

module.exports = async (client, event) => {
  try {
    const text = event?.content?.t?.toLowerCase();
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);

    const parts = text.split(" ");
    if (parts.length < 3) {
      return await message.reply({
        t: "❌ Cú pháp đúng: `*exercise <môn học> <chủ đề>`\nVí dụ: *exercise math integration"
      });
    }

    const subject = parts[1];
    const topic = parts.slice(2).join(" ");

    const prompt = `Hãy tạo danh sách 5 bài tập ngắn về chủ đề "${topic}" trong môn "${subject}". Không kèm lời giải. Đánh số 1 đến 5.`;

    const reply = await generateGeminiText(prompt);

    await message.reply({
      t: `📚 Bài tập về **${subject.toUpperCase()} - ${topic}**:\n\n${reply}`
    });
  } catch (error) {
    console.error("Lỗi ở *exercise:", error);
    const channel = await client.channels.fetch(event.channel_id);
    const message = await channel.messages.fetch(event.message_id);
    await message.reply({ t: "⚠️ Có lỗi xảy ra khi gọi Gemini API!" });
  }
};
