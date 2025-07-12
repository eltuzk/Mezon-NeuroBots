
# 🤖 Mezon-NeuroBots

Một **bot học tập thông minh** được xây dựng bằng Mezon SDK và Google Gemini API, giúp học sinh cấp 3 học hiệu quả hơn với các tính năng như tạo bài tập tự luận, hướng dẫn giải, trắc nghiệm, tài liệu tham khảo và nhắc lịch học.

---

## 🚀 Tính năng chính

| Lệnh                  | Mô tả |
|-----------------------|-------|
| `*bai_tap`            | Tạo bài tập ngắn tự luận theo môn học và chủ đề. |
| `*huong_dan`          | Hướng dẫn chi tiết cách giải đề bài cụ thể. |
| `*trac_nghiem`        | Tạo 3 câu hỏi trắc nghiệm có đáp án. |
| `*tai_lieu`           | Gợi ý 3 tài liệu học tập uy tín cho môn học. |
| `*nhac_lich`          | Đặt lịch học (giờ & ngày cụ thể). |
| `*xoa_lich`           | Hủy lịch học đã đặt. |
| `*xem_lich`           | Hiển thị danh sách lịch học đã lưu. |
| `*gioi_thieu_bot`     | Hiển thị hướng dẫn sử dụng bot. |

---

## ☁️ Triển khai trên Mezon

### Bước 1: Tạo ứng dụng Mezon

- Truy cập [https://mezon.dev](https://mezon.ai/)
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
# hoặc
yarn install
```

### 3. Cấu hình `.env`

Tạo file `.env` từ mẫu:

```bash
cp .env.example .env
```

Điền thông tin:

```env
APPLICATION_TOKEN=your_mezon_token
MEZON_API_KEY=your_mezon_api_key
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## ▶️ Chạy bot

### Khởi chạy bot chính:

```bash
npm start
# hoặc
node index.js
```

### Chạy riêng tiến trình nhắc lịch học mỗi phút:

```bash
node scheduler.js
```

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

---

## 🧠 Công nghệ sử dụng

- **Mezon SDK** – giao tiếp với nền tảng Mezon.
- **Google Gemini API** – tạo nội dung AI cho giáo dục.
- **Node.js**, **node-cron**, **dotenv**, **concurrently**, **nodemon**.

---

## 📈 Tính năng streak học tập

Khi bạn sử dụng các lệnh như `*bai_tap`, `*huong_dan`, `*trac_nghiem`, `*tai_lieu`, bot sẽ tự động cập nhật **streak ngày học liên tiếp** để giúp bạn duy trì thói quen học tập hằng ngày.

---

## 🛡 Lưu ý bảo mật

- Các file như `.env`, `streakData.json`, `reminders.json` đã được đưa vào `.gitignore` – KHÔNG nên commit lên GitHub.
- API key cần bảo mật tuyệt đối.

---

## 🧪 Ghi chú bản quyền

Dự án thuộc sở hữu của nhóm phát triển **NeuroBots**, được xây dựng cho **mục đích học tập và nghiên cứu** trong hệ sinh thái **Mezon**.

Không khuyến khích sử dụng cho mục đích thương mại nếu chưa có sự đồng ý của nhóm phát triển.

---
