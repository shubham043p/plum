require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

console.log("Testing Raw URL:", `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=HIDDEN`);

fetch(URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: "Hello" }]
    }]
  })
})
.then(async res => {
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text);
})
.catch(err => console.error("Fetch Error:", err));
