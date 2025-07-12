const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Khởi tạo client với API KEY

async function generateGeminiText(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Chọn model Gemini 2.0 Flash
    const result = await model.generateContent(prompt); // Gửi prompt tới Gemini
    const response = await result.response;
    return response.text(); // Trả về chuỗi kết quả
  } catch (error) {
    console.error("Gemini API error:", error);
    return "❌ Không thể lấy dữ liệu từ Gemini."; // Thông báo lỗi
  }
}

module.exports = { generateGeminiText };
