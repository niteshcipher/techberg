import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Updated for React Router v6

const GoalSetupPage = () => {
  const [goalText, setGoalText] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/generate-roadmap', {
        goalText,
      });

      console.log('API Response:', res.data);

      if (!res.data.roadmap || !res.data.roadmap.nodes) {
        throw new Error('Invalid roadmap data received');
      }

      setRoadmap(res.data.roadmap);
    } catch (err) {
      console.error('Error fetching roadmap:', err);
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNodeChange = (index, field, value) => {
    const updatedNodes = [...roadmap.nodes];
    updatedNodes[index][field] = value;
    setRoadmap({ ...roadmap, nodes: updatedNodes });
  };

  const saveRoadmap = () => {
    // Retrieve existing roadmaps from localStorage (if any)
    const savedRoadmaps = JSON.parse(localStorage.getItem('savedRoadmaps')) || [];

    // Add the new roadmap to the saved roadmaps array
    savedRoadmaps.push(roadmap);

    // Save the updated array back to localStorage
    localStorage.setItem('savedRoadmaps', JSON.stringify(savedRoadmaps));

    // Optionally, you can also store achievements or other data here

    // Redirect to the dashboard page after saving
    navigate('/dashboard'); // Updated to use navigate instead of history.push
  };

  const backmap = () => {
    // Retrieve existing roadmaps from localStorage (if any)
    // const savedRoadmaps = JSON.parse(localStorage.getItem('savedRoadmaps')) || [];

    // // Add the new roadmap to the saved roadmaps array
    // savedRoadmaps.push(roadmap);

    // // Save the updated array back to localStorage
    // localStorage.setItem('savedRoadmaps', JSON.stringify(savedRoadmaps));

    // // Optionally, you can also store achievements or other data here

    // Redirect to the dashboard page after saving
    navigate('/'); // Updated to use navigate instead of history.push
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-green-500 opacity-10 blur-3xl"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold mb-6"
        >
          Learning Roadmap Generator
        </motion.h1>

        <div className="bg-black bg-opacity-80 rounded-lg shadow-md p-6 mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl font-semibold mb-4"
          >
            Generate Your Learning Roadmap
          </motion.h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="goalInput" className="block text-sm font-medium mb-1">
                What do you want to learn?
              </label>
              <input
                id="goalInput"
                type="text"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="e.g. Learn JavaScript for web development"
                className="w-full p-3 border rounded-lg bg-gray-800 text-white focus:ring-green-500"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-400 disabled:bg-green-300"
              >
                {loading ? 'Generating...' : 'Generate Roadmap'}
              </button>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
          </form>
        </div>

        {roadmap && (
          <div className="bg-black bg-opacity-80 rounded-lg shadow-md p-6">
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl font-semibold mb-2"
            >
              {roadmap.title}
            </motion.h2>
            <p className="mb-4">{roadmap.description}</p>

            <div className="space-y-4">
              {roadmap.nodes.map((node, index) => (
                <div key={node.id} className="p-4 border rounded-lg bg-gray-800">
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Title</label>
                    <input
                      type="text"
                      value={node.title}
                      onChange={(e) => handleNodeChange(index, 'title', e.target.value)}
                      className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring-green-500"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                      value={node.description}
                      onChange={(e) => handleNodeChange(index, 'description', e.target.value)}
                      className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring-green-500"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium">Level</label>
                    <input
                      type="number"
                      value={node.level}
                      onChange={(e) => handleNodeChange(index, 'level', e.target.value)}
                      className="w-full p-2 border rounded-lg bg-gray-700 text-white focus:ring-green-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={saveRoadmap}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500"
            >
              Save Roadmap
            </button>
            <button
              onClick={backmap}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500"
            >
              Back
            </button>

            {/* <div className="mt-10 text-center">
          <Link
            to="/LandingPage"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500"
          >
            Go Back 
          </Link>
        </div> */}
          </div>
        )}

        {/* Instructions Section */}
        <div className="bg-black bg-opacity-80 p-6 mt-10 rounded-lg shadow-md">
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl font-semibold mb-4"
          >
            How to Use the Roadmap Generator
          </motion.h2>
          <p className="text-sm mb-4">
            Welcome to the Learning Roadmap Generator! Here's how you can get started:
          </p>
          <ul className="list-disc pl-5 text-sm">
            <li className="mb-2">Step 1: Enter your learning goal in the text box above. This could be anything from "Learn Python" to "Build a web app."</li>
            <li className="mb-2">Step 2: Once you click "Generate Roadmap," we will create a personalized learning path with tasks and resources to help you achieve your goal.</li>
            <li className="mb-2">Step 3: You can edit each task in the roadmap, including its title, description, and difficulty level. Customize it as per your needs.</li>
            <li className="mb-2">Step 4: Once you're happy with your roadmap, hit the "Save Roadmap" button to save it and continue later or track your progress.</li>
          </ul>
          <p className="mt-4 text-sm text-gray-400">
            Need more help? Check out our <a href="#" className="text-green-500">FAQ</a> or reach out to us via our support page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoalSetupPage;
