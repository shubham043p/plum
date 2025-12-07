import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import QuizResult from '../models/QuizResult';
import auth from '../middleware/auth';

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Generate Quiz
router.post('/generate', auth, async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    // Using gemini-2.0-flash as verified to work
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate 5 multiple choice questions about "${topic}". 
    Return ONLY a raw JSON array (no markdown code blocks) with this structure:
    [
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswerIndex": 0 // 0-3
      }
    ]`;

    console.log('Generating quiz for topic:', topic);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON array
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in response');
    
    const questions = JSON.parse(jsonMatch[0]);

    res.json(questions);
  } catch (err: any) {
    console.error('Quiz Gen Error:', err);
    res.status(500).send('Server Error');
  }
});

// Save Result
router.post('/save', auth, async (req: Request, res: Response) => {
  try {
    const { topic, score, totalQuestions } = req.body;
    
    // Generate witty remark
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Give a short, witty, 1-sentence remark for a user who scored ${score} out of ${totalQuestions} on a quiz about "${topic}".`;
    const result = await model.generateContent(prompt);
    const feedback = result.response.text().trim();

    const newResult = new QuizResult({
      userId: req.user?.id,
      topic,
      score,
      totalQuestions,
      feedback
    });

    await newResult.save();
    res.json(newResult);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get History
router.get('/history', auth, async (req: Request, res: Response) => {
  try {
    const history = await QuizResult.find({ userId: req.user?.id } as any).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;
