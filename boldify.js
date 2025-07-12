module.exports = function boldify(text) {
  const result = { t: "", mk: [] };
  let i = 0;

  while (i < text.length) {
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        const boldContent = text.slice(i + 2, end);
        const start = result.t.length;
        result.t += boldContent;
        const endIdx = result.t.length;
        result.mk.push({ type: "b", s: start, e: endIdx });
        i = end + 2;
      } else {
        result.t += text[i];
        i++;
      }
    } else {
      result.t += text[i];
      i++;
    }
  }

  return result;
};
