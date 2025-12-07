import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Play, Clock, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [customTopic, setCustomTopic] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const navigate = useNavigate();

  const topics = ['Wellness', 'Technology', 'History', 'Science', 'Pop Culture'];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/quiz/history');
        setRecentActivity(res.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingActivity(false);
      }
    };
    fetchHistory();
  }, []);

  const startQuiz = (topic) => {
    navigate('/quiz', { state: { topic } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Start Quiz */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Sparkles className="text-yellow-500 dark:text-yellow-400" />
              <span>Start a New Quiz</span>
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {topics.map((topic, index) => (
                <motion.button
                  key={topic}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startQuiz(topic)}
                  className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 p-4 rounded-xl text-center text-gray-800 dark:text-white transition-colors shadow-sm"
                >
                  {topic}
                </motion.button>
              ))}
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Or enter a custom topic..."
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                className="glass-input flex-1"
              />
              <button 
                onClick={() => customTopic && startQuiz(customTopic)}
                className="btn-primary flex items-center gap-2"
                disabled={!customTopic}
              >
                <Play size={18} />
                Start
              </button>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - Recent Activity */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-2xl h-full"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock className="text-blue-500 dark:text-blue-400" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {loadingActivity ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-white"></div>
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((item: any) => (
                  <div key={item._id} className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-gray-200 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-purple-600 dark:text-purple-300">{item.topic}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">{item.score}/{item.totalQuestions}</span>
                      <span className="text-xs bg-gray-200 dark:bg-white/10 px-2 py-1 rounded text-gray-600 dark:text-gray-300">Score</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No quizzes taken yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
