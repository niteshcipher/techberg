// src/pages/LandingPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-green-500 opacity-10 blur-3xl"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 z-10 relative">
        <div className="text-2xl font-bold tracking-widest">Questify</div>
        <div>
          <Link
            to="/auth"
            className="border border-green-500 px-6 py-2 rounded-full hover:bg-green-500 hover:text-black transition"
          >
            Contact
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 pt-10 z-10 relative">
        {/* Left Side Text */}
        <div className="flex flex-col space-y-6 max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
          >
            Revolutionize <br /> Your Learning
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-green-400 text-lg"
          >
            "Unleash your inner warrior to conquer your dreams."
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Link
              to="/auth"
              className="mt-6 inline-block bg-green-500 text-black px-8 py-4 rounded-full font-semibold hover:bg-green-400 transition transform hover:scale-105"
            >
              Start Your Quest
            </Link>
          </motion.div>
        </div>

        {/* Right Side Image */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative mt-10 md:mt-0"
        >
          {/* Green brush stroke behind */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-green-500 opacity-10 blur-2xl rounded-full"></div>

          {/* Placeholder Hero Image */}
          <img
            src="https://i.pinimg.com/474x/8e/02/13/8e021390e1a39ec64d0137380c470f27.jpg" // Replace with your actual image path
            alt="Hero"
            className="w-[350px] md:w-[450px] rounded-lg object-cover shadow-lg"
          />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-sm text-gray-500">
        © 2025 Questify. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;