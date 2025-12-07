import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Trophy } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/quiz/history');
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="text-center mt-20 text-white">Loading history...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
        <Trophy className="text-yellow-500 dark:text-yellow-400" />
        Your Quiz History
      </h2>
      
      <div className="space-y-4">
        {history.map((item: any, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl font-bold text-purple-600 dark:text-purple-300">{item.topic}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">"{item.feedback}"</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center bg-gray-100 dark:bg-white/5 p-3 rounded-lg min-w-[80px] border border-gray-200 dark:border-white/5 shadow-sm">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.score}/{item.totalQuestions}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {history.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">No history found. Start a quiz!</p>
        )}
      </div>
    </div>
  );
};

export default History;
