import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // After login/register, navigate to the GoalSetupPage
    navigate('/goal-setup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-[400px]">
        <h1 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}> {/* Add onSubmit */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={toggleAuthMode}
            className="text-green-400 font-bold ml-2 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}