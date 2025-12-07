require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  console.log("--- Starting Gemini API Test ---");
  try {
    // 1. Check API Key
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error("❌ ERROR: GEMINI_API_KEY is missing in .env file.");
      return;
    }
    console.log(`✅ API Key found: ${key.substring(0, 5)}...`);

    // 2. Initialize Client
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // 3. Test Generation
    console.log("🔄 Sending request to Gemini...");
    const prompt = `Generate 1 short question about space. Return JSON only.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ Response received!");
    console.log("--- Raw Output ---");
    console.log(text);
    console.log("------------------");

  } catch (err) {
    console.error("\n!!! TEST FAILED !!!");
    console.error(err.message);
  }
}

test();
