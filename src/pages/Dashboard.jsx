import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import GoalItem from '../components/GoalItem';
import useApi from '../hooks/useApi';

/**
 * @typedef {Object} Goal
 * @property {string} id - The unique identifier for the goal.
 * @property {string} name - The name of the goal.
 * @property {number} progress - The current progress of the goal.
 * @property {number} target - The target value for the goal.
 * @property {string} createdAt - The date when the goal was created.
 */

/**
 * Dashboard component
 *
 * This component serves as the main dashboard for authenticated users, displaying
 * their goals and providing a logout option. It uses the useAuth hook to manage
 * authentication state and the useApi hook to fetch user goals. It includes
 * error handling, loading states, and conditional rendering based on the
 * authentication status. It uses Tailwind CSS for styling.
 *
 * Test cases:
 * 1.  User authentication check: should render a loading message while checking for authentication
 *     and a dashboard with user info if authenticated. If not authenticated, the component
 *     should render null.
 * 2. Data fetching test: The data fetching test should mock the useApi hook to simulate
 *     a successful api call with goal data and an error api call. Should display data on
 *     success and an error if api call fails. Should handle the loading state.
 */
const Dashboard = () => {
  const { isAuthenticated, user, logout, checkAuth } = useAuth();
  const { get } = useApi();
  const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check for authentication on mount and when checkAuth changes
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
    // Fetch user goals when the component mounts or when the user is authenticated
    const fetchGoals = async () => {
        if (isAuthenticated) {
          try {
              setLoading(true);
              setError(null);
            const data = await get('/goals');
            setGoals(data);
          } catch (err: any) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
        }
      };
      fetchGoals();
  }, [get, isAuthenticated]);


    // Conditional rendering: If not authenticated, return null
  if (!isAuthenticated) {
      return null;
  }


    const handleLogout = () => {
    logout();
  };

  return (
    <div className="container p-4 flex flex-col items-center justify-start min-h-screen bg-gray-100">
      {/* Dashboard content */}
      <h2 className="text-2xl text-gray-800 font-bold mb-4">Dashboard</h2>
        {/* Conditional rendering: If there is an error, display the error message */}
      {error && <div className="text-red-500 my-2">{error}</div>}
         {/* Conditional rendering: If is loading, display the loading message */}
       {loading && <div className="text-gray-500 my-2">Loading goals...</div>}
      {user && <p className="text-xl text-gray-700 mb-4">Welcome {user.username} </p>}
        <Button onClick={handleLogout} style={{marginTop: '10px'}}>Logout</Button>
      <div className="w-full max-w-2xl mt-4">
            {/* Conditional rendering: If there are goals, map over them. If not display a message*/}
        {goals && goals.length > 0 ? (
          goals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} />
          ))
        ) : (
            !loading && <div className="text-gray-500 my-2">No goals found</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;