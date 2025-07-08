module.exports = async (client, event) => {
  const text = event?.content?.t?.toLowerCase();
  const channel = await client.channels.fetch(event.channel_id);
  const message = await channel.messages.fetch(event.message_id);
  const parts = text.split(" ");
  const number = parts[1] || "1";

  await message.reply({
    t: `🧠 Hướng dẫn giải bài ${number}:\n\nBước 1: ...\nBước 2: ...\nKết quả: ...`
  });
};
