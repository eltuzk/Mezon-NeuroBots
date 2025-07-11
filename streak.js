const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "streakData.json");

// Đọc file JSON, trả về object { userId: { lastDate, streak } }
function loadStreakData() {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

// Ghi dữ liệu vào file
function saveStreakData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Hàm cập nhật streak
function updateStreak(userId) {
  const data = loadStreakData();
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

  const user = data[userId] || { lastDate: null, streak: 0 };  // Nếu user chưa có trong data => khởi tạo
  
  if (user.lastDate === today) { // Đã ghi nhận hôm nay rồi → không cập nhật
    return { updated: false, streak: user.streak };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (user.lastDate === yesterday) {  // Hoạt động liên tiếp → tăng streak
    user.streak += 1;
  } 
  else {
    user.streak = 1; // Bỏ cách ≥ 1 ngày → reset streak về 1
  }

  // Cập nhật ngày cuối & lưu vào object
  user.lastDate = today;
  data[userId] = user;
  saveStreakData(data);   // Ghi lại file

  return { updated: true, streak: user.streak };
}

module.exports = { updateStreak };
