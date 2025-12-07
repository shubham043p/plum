import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const Quiz = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const topic = state?.topic || 'General Knowledge';

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false); // To show correct/incorrect before moving next

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/quiz/generate', { topic });
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert('Failed to generate quiz. Please try again.');
        navigate('/');
      }
    };
    generateQuiz();
  }, [topic, navigate]);

  const handleOptionClick = (index) => {
    if (showFeedback) return;
    setSelectedOption(index);
    setShowFeedback(true);

    if (index === questions[currentQuestion].correctAnswerIndex) {
      setScore(score + 1);
    }

    // Wait 1.5s then move to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        finishQuiz(score + (index === questions[currentQuestion].correctAnswerIndex ? 1 : 0));
      }
    }, 1500);
  };

  const finishQuiz = async (finalScore) => {
    setSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/quiz/save', {
        topic,
        score: finalScore,
        totalQuestions: questions.length
      });
      navigate('/results', { state: { result: res.data } });
    } catch (err) {
      console.error(err);
      alert('Error saving results');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-gray-900 dark:text-white">
        <Loader2 className="animate-spin mb-4 text-purple-600 dark:text-purple-500" size={48} />
        <h2 className="text-2xl font-bold animate-pulse">Curating questions for {topic}...</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Consulting the AI knowledge base</p>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-gray-900 dark:text-white">
        <Loader2 className="animate-spin mb-4 text-blue-600 dark:text-blue-500" size={48} />
        <h2 className="text-2xl font-bold">Calculating your score...</h2>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-8">
        <motion.div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
        ></motion.div>
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-panel p-8 rounded-2xl"
        >
          <div className="mb-8">
            <span className="text-sm text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <h2 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{question.question}</h2>
          </div>

          <div className="space-y-4">
            {question.options.map((option, index) => {
              let optionClass = "w-full p-4 rounded-xl text-left transition-all border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200";
              
              if (showFeedback) {
                if (index === question.correctAnswerIndex) {
                  optionClass = "w-full p-4 rounded-xl text-left border border-green-500 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-200";
                } else if (index === selectedOption) {
                  optionClass = "w-full p-4 rounded-xl text-left border border-red-500 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-200";
                } else {
                  optionClass = "w-full p-4 rounded-xl text-left border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 opacity-50 text-gray-400 dark:text-gray-500";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={showFeedback}
                  className={optionClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showFeedback && index === question.correctAnswerIndex && <CheckCircle size={20} />}
                    {showFeedback && index === selectedOption && index !== question.correctAnswerIndex && <XCircle size={20} />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
