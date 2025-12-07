require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Fetching models...");
fetch(URL)
.then(async res => {
  console.log("Status:", res.status);
  const data = await res.json();
  if (data.models) {
      const fs = require('fs');
      const geminiModels = data.models
        .filter(m => m.name.includes("gemini"))
        .map(m => `- ${m.name} (${m.version})`)
        .join('\n');
      
      fs.writeFileSync('models.txt', geminiModels);
      console.log("Written to models.txt");
  } else {
      console.log("Response:", JSON.stringify(data, null, 2));
  }
})
.catch(err => console.error("Fetch Error:", err));
