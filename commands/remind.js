module.exports = async (client, event) => {
  const text = event?.content?.t?.toLowerCase();
  const channel = await client.channels.fetch(event.channel_id);
  const message = await channel.messages.fetch(event.message_id);
  const parts = text.split(" ");

  if (parts.length < 3) {
    return await message.reply({
      t: "❌ Cú pháp đúng: `*remind <môn học> <giờ>`\nVí dụ: *remind math 20:00"
    });
  }

  const subject = parts[1];
  const time = parts[2];

  await message.reply({
    t: `⏰ Đã đặt nhắc nhở học **${subject}** vào **${time}** (demo).\n⚠️ Tính năng chạy lịch thật cần thêm hệ thống cron hoặc DB.`
  });
}; 

