import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * @typedef {Object} APIError
 * @property {string} message
 */


/**
 * Custom React hook for making API requests.
 * @returns {{
 *   get: (url: string) => Promise<any>,
 *   post: (url: string, data: any) => Promise<any>,
 *   put: (url: string, data: any) => Promise<any>,
 *   delete: (url: string) => Promise<any>
 * }} An object containing functions for making API requests.
 */
const useApi = () => {
    const api = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const { logout } = useContext(AuthContext);
            if (error.response && error.response.status === 401) {
                if(logout){
                    logout();
                }
            }
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('API Error:', error.response.data);
                 throw { message: `API Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}` };
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Network Error:', error.request);
                  throw { message: 'Network Error: No response received from the server' };
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Request setup error', error.message);
                  throw { message: `Request setup error: ${error.message}`};
            }


            return Promise.reject(error);
        }
    );

    /**
     * Makes a GET request to the specified URL.
     * @param {string} url - The URL to make the request to.
     * @returns {Promise<any>} A promise that resolves with the response data.
     * @throws {APIError} If the URL is missing or if the request fails.
     */
    const get = async (url) => {
        if (!url) {
            throw { message: 'URL is required for GET request' };
        }
        try {
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Makes a POST request to the specified URL with the given data.
     * @param {string} url - The URL to make the request to.
     * @param {any} data - The data to send with the request.
     * @returns {Promise<any>} A promise that resolves with the response data.
     * @throws {APIError} If the URL or data is missing, or if the request fails.
     */
    const post = async (url, data) => {
         if (!url) {
              throw { message: 'URL is required for POST request' };
          }
        if (!data) {
            throw { message: 'Data is required for POST request' };
        }
        try {
            const response = await api.post(url, JSON.stringify(data));
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Makes a PUT request to the specified URL with the given data.
     * @param {string} url - The URL to make the request to.
     * @param {any} data - The data to send with the request.
     * @returns {Promise<any>} A promise that resolves with the response data.
     * @throws {APIError} If the URL or data is missing, or if the request fails.
     */
    const put = async (url, data) => {
        if (!url) {
            throw { message: 'URL is required for PUT request' };
        }
        if (!data) {
            throw { message: 'Data is required for PUT request' };
        }
        try {
            const response = await api.put(url, JSON.stringify(data));
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Makes a DELETE request to the specified URL.
     * @param {string} url - The URL to make the request to.
     * @returns {Promise<any>} A promise that resolves with the response data.
     * @throws {APIError} If the URL is missing or if the request fails.
     */
    const del = async (url) => {
        if (!url) {
             throw { message: 'URL is required for DELETE request' };
        }
        try {
            const response = await api.delete(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        get,
        post,
        put,
        delete: del,
    };
};

export default useApi;

/* Example Usage:

// In src/pages/Goals.jsx:

import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';

const GoalsPage = () => {
  const { get, post, put, delete: del } = useApi();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
        try {
            setLoading(true);
          const data = await get('/goals');
          setGoals(data);
        } catch (err) {
          setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchGoals();
  }, [get]);

  const handleAddGoal = async () => {
      try {
          setLoading(true);
        const newGoal = await post('/goals', { name: 'New Goal' });
        setGoals([...goals, newGoal]);
      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

    const handleUpdateGoal = async (id, updatedGoal) => {
        try {
            setLoading(true);
            const updatedData = await put(`/goals/${id}`, updatedGoal);
            setGoals(goals.map(goal => goal.id === id ? updatedData : goal));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGoal = async (id) => {
        try {
            setLoading(true);
           await del(`/goals/${id}`);
           setGoals(goals.filter(goal => goal.id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
  if(loading){
    return <div>Loading goals...</div>
  }

  if(error){
    return <div>Error: {error}</div>
  }

  return (
    <div>
        <h2>Goals</h2>
        <button onClick={handleAddGoal}>Add Goal</button>
        {goals.map(goal => (
            <div key={goal.id}>
                <p>{goal.name}</p>
                <button onClick={() => handleUpdateGoal(goal.id, {name: 'Updated Goal'})}>Update Goal</button>
                <button onClick={() => handleDeleteGoal(goal.id)}>Delete Goal</button>
            </div>
        ))}
    </div>
  );
};

export default GoalsPage;
*/