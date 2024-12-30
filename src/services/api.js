import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

/**
 * @typedef {Object} AuthContextType
 * @property {boolean} isAuthenticated
 * @property {{id: string, username: string} | null} user
 * @property {(username: string, password: string) => Promise<void>} login
 * @property {() => void} logout
 * @property {() => Promise<void>} checkAuth
 */

/**
 * @typedef {Object} AxiosError
 * @property {string} message
 * @property {number} status
 */

/**
 * @typedef {Object} APIError
 * @property {string} message
 */

/**
 * Handles response errors by logging them and throwing a generic APIError
 * @param {AxiosError} error
 * @throws {APIError}
 */
const handleResponseError = (error) => {
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
};

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
      handleResponseError(error);
    return Promise.reject(error);
  }
);

/**
 * Makes a GET request to the specified URL
 * @param {string} url
 * @returns {Promise<any>}
 */
api.get = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
      throw error;
  }
};

/**
 * Makes a POST request to the specified URL with the given data
 * @param {string} url
 * @param {any} data
 * @returns {Promise<any>}
 */
api.post = async (url, data) => {
  try {
    const response = await api.post(url, JSON.stringify(data));
    return response.data;
  } catch (error) {
      throw error;
  }
};

/**
 * Makes a PUT request to the specified URL with the given data
 * @param {string} url
 * @param {any} data
 * @returns {Promise<any>}
 */
api.put = async (url, data) => {
  try {
    const response = await api.put(url, JSON.stringify(data));
    return response.data;
  } catch (error) {
      throw error;
  }
};

/**
 * Makes a DELETE request to the specified URL
 * @param {string} url
 * @returns {Promise<any>}
 */
api.delete = async (url) => {
  try {
    const response = await api.delete(url);
      return response.data;
  } catch (error) {
      throw error;
  }
};


// Example requests
// api.get('/goals')
// api.post('/goals', { name: 'new goal' })
// api.put('/goals/1', { name: 'updated goal' })
// api.delete('/goals/1')

export default api;