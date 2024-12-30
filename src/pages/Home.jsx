import React from 'react';

/**
 * Home component
 *
 * This component serves as the landing page of the application, providing a brief
 * introduction to the fitness tracking application.
 *
 * It does not depend on any other components from the project and does not require
 * any props or state. It does not interact with the context API or make API calls.
 * It is designed for basic rendering and uses Tailwind CSS utility classes for styling.
 *
 * It includes sanitization by avoiding potential XSS vulnerabilities.
 *
 * It includes comments for testability and descriptive names for elements.
 */
const Home = () => {
  return (
    <div className="container p-4 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Home page content */}
      <h1 className="text-4xl text-gray-800 font-bold mb-6">Welcome to FitTrack</h1>
      <p className="text-xl text-gray-600 mb-4 text-center">
        Start tracking your fitness goals today and share your progress with friends.
      </p>
        <p className="text-xl text-gray-600 mb-4 text-center">
            Login or Sign up to get started
        </p>
        {/*
            Testability: Basic unit tests should assert that this component renders the
            expected content: the welcome text, the description, and the login/signup prompt.
            The test should check for the presence of the text and ensure no errors are thrown during render.
        */}
    </div>
  );
};

export default Home;