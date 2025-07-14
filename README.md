# 🤖 Mezon-NeuroBots


## 💡 Ý tưởng dự án

Mezon-NeuroBots được xây dựng với mục tiêu hỗ trợ học sinh cấp 3 học tập hiệu quả thông qua các tiện ích học tập thông minh tích hợp AI. Thay vì tìm kiếm tài liệu rời rạc hoặc học tập thiếu kế hoạch, bot đóng vai trò như một **trợ lý học tập tự động** giúp người dùng:

- ✅ **Tạo bài tập tự luận hoặc trắc nghiệm nhanh chóng** để ôn luyện.
- ✅ **Cung cấp tài liệu tham khảo chính thống** từ các nguồn đáng tin cậy.
- ✅ **Đặt lịch học và nhắc lịch thông minh**, đảm bảo học tập đều đặn.
- ✅ **Theo dõi streak ngày học liên tiếp** để duy trì động lực học tập mỗi ngày.

Bot được thiết kế hướng tới sự **đơn giản khi sử dụng**, **linh hoạt cho nhiều môn học**, đồng thời giúp học sinh hình thành **thói quen học tập tự chủ**.

## 🧩 Logic hoạt động của bot

### 📝 Tạo nội dung học tập

Các lệnh như `*bai_tap`, `*huong_dan`, `*trac_nghiem`, `*tai_lieu` được kết nối trực tiếp với Google Gemini API để tạo bài tập, câu hỏi, hướng dẫn giải và tài liệu tham khảo dựa trên yêu cầu người dùng.

### ⏰ Nhắc lịch học

Sử dụng `node-cron` để thiết lập tiến trình tự động chạy mỗi phút.

Bot đọc dữ liệu từ `reminders.json`, khi đến đúng thời gian học tập sẽ tự động gửi tin nhắc nhở trong kênh chat.

### 🔥 Theo dõi streak học tập

Mỗi lần người dùng sử dụng bất kỳ lệnh nào của bot, hệ thống sẽ kiểm tra và cập nhật streak qua `streak.js`.

Streak tăng khi học liên tiếp ngày và reset về 1 nếu bỏ cách ngày.

### 💬 Giao tiếp qua Mezon SDK

Bot hoạt động trực tiếp trên nền tảng Mezon, dễ dàng tích hợp vào các nhóm học tập (Clan) để mọi thành viên đều có thể sử dụng ngay trong kênh chat.

---


Một **bot học tập thông minh** được xây dựng bằng Mezon SDK và Google Gemini API, giúp học sinh cấp 3 học hiệu quả hơn với các tính năng như tạo bài tập tự luận, hướng dẫn giải, trắc nghiệm, tài liệu tham khảo và nhắc lịch học.

---

## 🚀 Tính năng chính

| Lệnh | Mô tả |
|-----------------------|-------|
| `*gioi_thieu_bot` | Hiển thị hướng dẫn sử dụng bot. |
| `*bai_tap` | Tạo bài tập ngắn tự luận theo môn học và chủ đề. |
| `*huong_dan` | Hướng dẫn chi tiết cách giải đề bài cụ thể. |
| `*trac_nghiem` | Tạo 3 câu hỏi trắc nghiệm có đáp án. |
| `*tai_lieu` | Gợi ý 3 tài liệu học tập uy tín cho môn học. |
| `*nhac_lich` | Đặt lịch học (giờ & ngày cụ thể). |
| `*xoa_lich` | Hủy lịch học đã đặt. |
| `*xem_lich` | Hiển thị danh sách lịch học đã lưu. |
| `*streak` | Kiểm tra số ngày học liên tiếp của bạn và khuyến khích duy trì thói quen học tập đều đặn. |

🧠 **Lưu ý:** Streak được cập nhật tự động khi bạn dùng bot mỗi ngày, không cần lệnh riêng để kiểm tra.

---

## ☁️ Triển khai trên Mezon

### Bước 1: Tạo ứng dụng Mezon

- Truy cập [Mezon Developer Portal](https://mezon.ai/)
- Đăng nhập và tạo **ứng dụng mới**
- Lưu lại `Application Token` và `API Key` → sử dụng trong `.env`

### Bước 2: Thêm bot vào một Clan

- Truy cập Clan (cộng đồng học tập) bạn muốn dùng bot
- Vào phần **Cài đặt Bot > Thêm Bot**
- Chọn bot bạn vừa tạo hoặc nhập `Application ID`
- Bot sẽ tự động xuất hiện trong kênh chat

---

## 🛠️ Cài đặt

### 1. Clone dự án

```bash
git clone https://github.com/yourname/mezon-neurobots.git
cd mezon-neurobots
```

### 2. Cài đặt dependencies

```bash
npm install
npm install node-cron
```

### 3. Cấu hình `.env`

Tạo file `.env` từ mẫu:

```bash
$ cp .env.example .env
```

Điền thông tin:

```env
APPLICATION_TOKEN=your_mezon_token
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## ▶️ Chạy bot

### Khởi chạy bot chính:

```bash
npm run start
```

### Tạo thêm 1 terminal riêng để nhắc lịch học:

```bash
npm run scheduler
```

🟢 **Lưu ý:** Bot chính và scheduler nhắc lịch cần chạy **độc lập**, bạn phải bật cả hai quy trình cùng lúc.

---

## 📁 Cấu trúc thư mục

```
.
├── commands/
│   ├── exercise.js
│   ├── guide.js
│   ├── quiz.js
│   ├── source.js
│   ├── remind.js
│   ├── delete_reminder.js
│   ├── view_reminders.js
│   └── usageGuide.js
├── streak.js
├── boldify.js
├── gemini.js
├── index.js
├── scheduler.js
├── reminders.json
├── streakData.json
├── .env
├── .env.example
├── package.json
└── README.md
```

- `boldify.js` – Hỗ trợ format chữ đậm trong tin nhắn bot, giúp làm nổi bật các phần thông báo quan trọng.

---

## 🧠 Công nghệ sử dụng

- **Mezon SDK** – giao tiếp với nền tảng Mezon.
- **Google Gemini API** – tạo nội dung AI cho giáo dục.
- **Node.js**, **node-cron**, **dotenv**, **concurrently**, **nodemon**.

---

## 📈 Tính năng streak học tập

Mỗi khi bạn sử dụng bất kỳ lệnh nào của bot trong ngày, bot sẽ tự động cập nhật **streak ngày học liên tiếp** để giúp bạn duy trì thói quen học tập hằng ngày.

Bạn có thể kiểm tra streak hiện tại bằng lệnh `*streak`.

🧠 **Lưu ý:** Streak được lưu vào file `streakData.json` dưới dạng lịch sử hoạt động mỗi người dùng.

---

## 📂 Ghi chú về file dữ liệu

- `reminders.json`: Lưu danh sách các lịch học bạn đã đặt.
- `streakData.json`: Lưu thông tin streak ngày học liên tiếp của người dùng.

⚠️ **Lưu ý:** Nếu bạn xóa hai file này, dữ liệu lịch học và streak sẽ bị mất và không thể khôi phục được!

---

## 🛡 Lưu ý bảo mật

- Các file như `.env`, `streakData.json`, `reminders.json` đã được đưa vào `.gitignore` – KHÔNG nên commit lên GitHub.
- API key cần bảo mật tuyệt đối.

---

## 🧪 Ghi chú bản quyền

Dự án thuộc sở hữu của nhóm phát triển **NeuroBots**, được xây dựng cho **mục đích học tập và nghiên cứu** trong hệ sinh thái **Mezon**.

---
