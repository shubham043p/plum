import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

const Results = () => {
  const { state } = useLocation();
  const result = state?.result;

  useEffect(() => {
    if (result) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  if (!result) return <div className="text-white text-center mt-20">No result data found.</div>;

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  let colorClass = "text-blue-400";
  if (percentage >= 80) colorClass = "text-green-400";
  if (percentage < 50) colorClass = "text-red-400";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-8 rounded-2xl w-full max-w-2xl text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="bg-gray-100 dark:bg-white/10 p-4 rounded-full">
            <Trophy size={64} className="text-yellow-500 dark:text-yellow-400" />
          </div>
        </div>

        <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Quiz Completed!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Topic: {result.topic}</p>

        <div className="mb-8">
          <div className="text-6xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            {percentage}%
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            You scored <span className={colorClass}>{result.score}</span> out of {result.totalQuestions}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl mb-8 border border-gray-200 dark:border-white/10 shadow-sm">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">AI Feedback</h3>
          <p className="text-lg italic text-gray-800 dark:text-white">"{result.feedback}"</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center gap-2">
            <RefreshCw size={18} />
            Play Again
          </Link>
          <Link to="/" className="bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2">
            <Home size={18} />
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;
