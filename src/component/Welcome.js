import React from "react";

const WelcomePage = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white px-6">
      <h1 className="text-6xl font-bold mb-6">Shortest Path Finder</h1>
      <h2 className="text-2xl font-medium mb-12">Find the shortest path quickly and easily</h2>
      <button
        onClick={onStart}
        className="px-10 py-3 bg-white text-blue-700 font-semibold rounded-md shadow-md hover:bg-gray-100 transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default WelcomePage;
