import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, SquareCheckBig, Square } from 'lucide-react';

const MAX_XP = 100;

const QuestMapPage = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [xp, setXp] = useState(0);
  const [activeLevel, setActiveLevel] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [videoLinks, setVideoLinks] = useState([]);

  useEffect(() => {
    const roadmaps = JSON.parse(localStorage.getItem('savedRoadmaps')) || [];
    const selectedRoadmap = roadmaps.find(r => r.id === id);

    if (selectedRoadmap) {
      if (!selectedRoadmap.levels || selectedRoadmap.levels.length === 0) {
        selectedRoadmap.levels = [
          {
            name: "Introduction Quest",
            description: "Learn the basics to start your journey!",
            tasks: [
              { name: "Watch intro video", xp: 5 },
              { name: "Read guidebook", xp: 10 }
            ]
          },
          {
            name: "First Battle",
            description: "Apply what you learned in a mini challenge.",
            tasks: [
              { name: "Solve a mini-project", xp: 15 },
              { name: "Submit your work", xp: 5 }
            ]
          },
          {
            name: "Semi Final",
            description: "Test your skills in a challenging scenario.",
            tasks: [
              { name: "Complete the semi-final project", xp: 20 },
              { name: "Review feedback", xp: 10 }
            ]
          },
          {
            name: "Final Boss",
            description: "Face the ultimate challenge to prove your mastery.",
            tasks: [
              { name: "Develop the final project", xp: 25 },
              { name: "Submit your final project", xp: 15 }
            ]
          }
        ];
        const updatedRoadmaps = roadmaps.map(r => (r.id === id ? selectedRoadmap : r));
        localStorage.setItem('savedRoadmaps', JSON.stringify(updatedRoadmaps));
      }

      setRoadmap(selectedRoadmap);

      setVideoLinks([
        { levelIndex: 0, link: "https://www.youtube.com/watch?v=sample1" },
        { levelIndex: 1, link: "https://www.youtube.com/watch?v=sample2" },
        { levelIndex: 2, link: "https://www.youtube.com/watch?v=sample3" },
        { levelIndex: 3, link: "https://www.youtube.com/watch?v=sample4" }
      ]);
    }

    setCompletedLevels(JSON.parse(localStorage.getItem(`completedLevels_${id}`)) || []);
    setXp(JSON.parse(localStorage.getItem(`xp_${id}`)) || 0);
    setCompletedTasks(JSON.parse(localStorage.getItem(`completedTasks_${id}`)) || {});
  }, [id]);

  const updateLocalStorage = (levels, xp, tasks) => {
    localStorage.setItem(`completedLevels_${id}`, JSON.stringify(levels));
    localStorage.setItem(`xp_${id}`, JSON.stringify(xp));
    localStorage.setItem(`completedTasks_${id}`, JSON.stringify(tasks));
  };

  const toggleTask = (levelIndex, taskIndex, taskXP) => {
    const updated = { ...completedTasks };
    const current = updated[levelIndex] || [];

    let updatedXP = xp;

    if (current.includes(taskIndex)) {
      updated[levelIndex] = current.filter(t => t !== taskIndex);
      updatedXP = Math.max(updatedXP - taskXP, 0);
    } else {
      updated[levelIndex] = [...current, taskIndex];
      updatedXP = Math.min(updatedXP + taskXP, MAX_XP);
    }

    setCompletedTasks(updated);
    setXp(updatedXP);
    updateLocalStorage(completedLevels, updatedXP, updated);
  };

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Loading...
        </motion.div>
      </div>
    );
  }

  const xpProgress = Math.min((xp / MAX_XP) * 100, 100);

  return (
    <div className="min-h-screen bg-black text-white p-6 relative flex">
      <div className="absolute inset-0 bg-purple-600 opacity-10 blur-3xl" />

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold mb-6 text-center"
        >
          {roadmap.title} - Quest Map
        </motion.h1>

        {/* XP Bar */}
        <div className="w-full bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-400 h-4"
          />
        </div>
        <p className="text-center text-yellow-300 mb-6 font-semibold">
          XP: {xp} / {MAX_XP}
        </p>

        {/* Levels */}
        <div className="flex flex-wrap justify-center gap-6">
          {roadmap.levels.map((level, index) => {
            const isCompleted = completedLevels.includes(index);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveLevel(index)}
                className={`cursor-pointer w-48 h-52 bg-gray-800 rounded-xl shadow-md flex flex-col items-center justify-center text-center p-4
                ${isCompleted ? 'border-4 border-yellow-400' : 'border-2 border-gray-600'}`}
              >
                {isCompleted ? (
                  <CheckCircle size={36} className="text-yellow-400 mb-2" />
                ) : (
                  <Circle size={36} className="text-gray-400 mb-2" />
                )}
                <h2 className="text-lg font-bold">{level.name}</h2>
                <p className="text-xs text-gray-400 mt-1">{level.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tasks Sidebar */}
      {activeLevel !== null && (
        <div className="w-[320px] bg-gray-900 border-l border-gray-700 p-4 z-10">
          <h2 className="text-xl font-bold mb-4">
            Tasks for: {roadmap.levels[activeLevel].name}
          </h2>

          {/* Video Link */}
          <div className="mb-4">
            {videoLinks
              .filter(link => link.levelIndex === activeLevel)
              .map((video, i) => (
                <a key={i} href={video.link} target="_blank" rel="noopener noreferrer">
                  <button className="w-full bg-blue-600 text-white rounded-md py-2 mb-4">
                    Watch Tutorial Video
                  </button>
                </a>
              ))}
          </div>

          {/* Reference Links */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Useful Links</h3>
            <ul className="text-sm space-y-2">
              <li><a href="https://docs.example.com" target="_blank" rel="noopener noreferrer" className="text-blue-400">Official Documentation</a></li>
              <li><a href="https://forum.example.com" target="_blank" rel="noopener noreferrer" className="text-blue-400">Community Forum</a></li>
            </ul>
          </div>

          {/* Tasks */}
          <ul className="space-y-3">
            {(roadmap.levels[activeLevel]?.tasks || []).map((task, i) => {
              const taskCompleted = completedTasks[activeLevel]?.includes(i);
              return (
                <li key={i} className="flex justify-between items-center bg-gray-800 rounded-md p-3">
                  <div>
                    <p className="text-sm">{task.name}</p>
                    <p className="text-xs text-yellow-300">+{task.xp} XP</p>
                  </div>
                  <button onClick={() => toggleTask(activeLevel, i, task.xp)}>
                    {taskCompleted ? (
                      <SquareCheckBig size={24} className="text-green-400" />
                    ) : (
                      <Square size={24} className="text-gray-400" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestMapPage;
