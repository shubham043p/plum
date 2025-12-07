require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

model.generateContent("Hello")
  .then(res => console.log("SUCCESS"))
  .catch(err => {
      console.log("ERROR_START");
      console.log(err.message);
      console.log("ERROR_END");
  });
