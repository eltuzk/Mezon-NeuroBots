module.exports = function boldify(text) {
  const result = { t: "", mk: [] }; // Kết quả: t là text đã loại bỏ dấu **, mk là mảng chứa các vị trí cần bôi đậm
  let i = 0;

  while (i < text.length) {
    // Nếu bắt gặp cặp dấu "**"
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2); // Tìm vị trí dấu "**" kết thúc
      if (end !== -1) {
        const boldContent = text.slice(i + 2, end); // Lấy nội dung giữa 2 dấu **
        const start = result.t.length;
        result.t += boldContent; // Thêm nội dung vào chuỗi kết quả
        const endIdx = result.t.length;
        result.mk.push({ type: "b", s: start, e: endIdx }); // Đánh dấu vị trí cần bôi đậm
        i = end + 2; // Tiếp tục duyệt sau dấu "**"
      } else {
        result.t += text[i];
        i++;
      }
    } else {
      result.t += text[i];
      i++;
    }
  }

  return result; // Trả về chuỗi không có dấu ** + vị trí cần bôi đậm
};
