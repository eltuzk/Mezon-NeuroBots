const dotenv = require("dotenv");
const { MezonClient } = require("mezon-sdk");

dotenv.config();

async function main() {
  const client = new MezonClient(process.env.APPLICATION_TOKEN);

  await client.login();

  client.onChannelMessage(async (event) => {
    const messageText = event?.content?.t?.toLowerCase();

    // Kiểm tra nếu người dùng gọi lệnh ping
    if (messageText === "*ping") {
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);

      await message.reply({ t: 'reply pong' });
      await channel.send({ t: 'channel send pong' });

      const clan = await client.clans.fetch(event.clan_id);
      const user = await clan.users.fetch(event.sender_id);
      await user.sendDM({ t: 'hello DM' });
    }

    // Bắt đầu xử lý khi người dùng nhập lệnh tìm bài
    else if (messageText?.startsWith("*exercise")) {
      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);

      // Split the message, e.g. "*exercise math integration" => ['*exercise', 'math', 'integration']
      const parts = messageText.split(" ");
      if (parts.length < 3) {
        await message.reply({ t: "❌ Please use the correct format: *exercise <subject> <topic>" });
        return;
      }

      const subject = parts[1]; // Subject: math, physics, chemistry, etc.
      const topic = parts.slice(2).join(" "); // Topic: integration, electric field, etc.

      // Mock data - replace this later with real database/API data
      const mockExercises = [
        `📘 Exercise 1 (${subject} - ${topic}): ...`,
        `📘 Exercise 2 (${subject} - ${topic}): ...`,
        `📘 Exercise 3 (${subject} - ${topic}): ...`,
        `📘 Exercise 4 (${subject} - ${topic}): ...`,
        `📘 Exercise 5 (${subject} - ${topic}): ...`,
        `📘 Exercise 6 (${subject} - ${topic}): ...`,
        `📘 Exercise 7 (${subject} - ${topic}): ...`,
        `📘 Exercise 8 (${subject} - ${topic}): ...`,
        `📘 Exercise 9 (${subject} - ${topic}): ...`,
        `📘 Exercise 10 (${subject} - ${topic}): ...`,
      ];

      // Gửi danh sách bài tập mẫu
      await message.reply({
        t: `Found 10 exercises for **${subject.toUpperCase()}** - **${topic}**:\n\n` +
          mockExercises.join("\n") +
          `\n\n💡 Type *guide <number> to view the solution.`
      });
    }

    // Nếu người dùng muốn xem hướng dẫn giải bài
    else if (messageText?.startsWith("*guide")) {
      const parts = messageText.split(" ");
      const exerciseNumber = parts[1] || "1";

      const channel = await client.channels.fetch(event.channel_id);
      const message = await channel.messages.fetch(event.message_id);

      await message.reply({
        t: `🧠 Solution for Exercise ${exerciseNumber}:\n\nStep 1: ...\nStep 2: ...\nAnswer: ...\n\n💬 You can comment or discuss this exercise!`
      });
    }
    
  });
}

main()
  .then(() => {
    console.log("bot start!");
  })
  .catch((error) => {
    console.error(error);
  });
