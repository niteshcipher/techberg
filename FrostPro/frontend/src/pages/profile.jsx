import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Trophy, Swords, BadgeCheck, Clipboard, Users } from 'lucide-react';

const MAX_XP = 100;

const ProfilePage = () => {
  const [xp, setXp] = useState(0);
  const [username, setUsername] = useState('Player1');
  const [friends, setFriends] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const savedXP = JSON.parse(localStorage.getItem('xp_default')) || 0;
    setXp(savedXP);

    const savedFriends = JSON.parse(localStorage.getItem('friends')) || [
      { name: 'ShadowHunter', xp: 80 },
      { name: 'CodeNinja', xp: 60 },
      { name: 'PixelWarrior', xp: 45 },
    ];
    setFriends(savedFriends.sort((a, b) => b.xp - a.xp));

    // Mock recent activities
    setRecentActivities([
      { action: 'Defeated CodeNinja in a battle!', time: '2 hours ago' },
      { action: 'Earned Badge: Master of the Code!', time: '5 hours ago' },
      { action: 'Challenged PixelWarrior to a duel!', time: '1 day ago' },
    ]);
  }, []);

  const xpProgress = Math.min((xp / MAX_XP) * 100, 100);

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center relative">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-purple-600 opacity-10 blur-3xl" />

      {/* Main Layout: Two Columns */}
      <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-12">
        {/* Left Column: Profile Pic and Achievements */}
        <div className="flex-1 flex flex-col items-center space-y-8">
          <motion.img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=profile"
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-yellow-400"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.8 }}
          />
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold">{username}</h1>
            <p className="text-yellow-300 font-semibold">Level Adventurer</p>

            {/* Achievements */}
            <div className="flex gap-8">
              <div className="flex flex-col items-center">
                <BadgeCheck size={40} className="text-green-400 mb-2" />
                <p className="text-sm">3 Badges</p>
              </div>
              <div className="flex flex-col items-center">
                <Swords size={40} className="text-red-400 mb-2" />
                <p className="text-sm">2 Battles</p>
              </div>
              <div className="flex flex-col items-center">
                <Trophy size={40} className="text-yellow-400 mb-2" />
                <p className="text-sm">Top 1%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: XP Progress, Friends Leaderboard, Recent Activity */}
        <div className="flex-1 flex flex-col items-start space-y-8">
          {/* XP Progress */}
          <div className="w-full max-w-lg bg-gray-700 rounded-full h-4 mb-6 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8 }}
              className="bg-yellow-400 h-4"
            />
          </div>
          <p className="text-yellow-300 text-lg">XP: {xp} / {MAX_XP}</p>

          {/* Friends Leaderboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl border border-gray-600"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Friends Leaderboard</h2>
            <div className="space-y-4">
              {friends.map((friend, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-400 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p className="font-semibold">{friend.name}</p>
                  </div>
                  <p className="text-yellow-300">{friend.xp} XP</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl border border-gray-600"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Recent Activity</h2>
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                <li key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="text-white">{activity.action}</p>
                    <span className="text-yellow-300 text-xs">{activity.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Challenge Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl shadow-md"
          >
            Challenge a Friend
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
