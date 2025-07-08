import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react'; // Optional: profile icon

const DashboardPage = () => {
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const roadmaps = JSON.parse(localStorage.getItem('savedRoadmaps')) || [];
    setSavedRoadmaps(roadmaps);
    setLoading(false);
  }, []);

  const handleDelete = (indexToDelete) => {
    const updatedRoadmaps = savedRoadmaps.filter((_, i) => i !== indexToDelete);
    localStorage.setItem('savedRoadmaps', JSON.stringify(updatedRoadmaps));
    setSavedRoadmaps(updatedRoadmaps);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold"
        >
          Loading your saved roadmaps...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-green-500 opacity-10 blur-3xl"></div>

      {/* Profile Button */}
      <div className="absolute top-4 right-6 z-20">
        <Link
          to="/profile"
          className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition"
        >
          <UserCircle size={24} />
          <span className="hidden md:inline">Profile</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold mb-6"
        >
          Your Roadmaps
        </motion.h1>

        <div className="bg-gray-900 bg-opacity-70 p-6 rounded-xl shadow-lg">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-2xl font-semibold mb-4"
          >
            Saved Roadmaps
          </motion.h2>

          {savedRoadmaps.length === 0 ? (
            <p className="text-lg text-gray-400">No saved roadmaps yet. Start creating some!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRoadmaps.map((roadmap, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 p-5 rounded-lg shadow-md flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold mb-2">{roadmap.title}</h3>
                    <p className="text-sm text-gray-300 mb-4">{roadmap.description}</p>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <button
                      onClick={() => navigate('/quest-map')}
                      className="text-green-400 hover:underline"
                    >
                      View Map
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Button to Go Back to Goal Setup */}
        <div className="mt-10 text-center">
          <Link
            to="/goal-setup"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500"
          >
            Go Back to Goal Setup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
