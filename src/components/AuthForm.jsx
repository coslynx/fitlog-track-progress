import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Input from './Input';
import Button from './Button';

/**
 * @typedef {Object} AuthFormProps
 */

/**
 * A component for user authentication including login and signup.
 * @param {AuthFormProps} props
 * @returns {JSX.Element}
 */
const AuthForm = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

  const validateForm = () => {
      if (!username.trim()) {
          setError('Username is required.');
          return false;
      }
      if (!password.trim()) {
          setError('Password is required.');
          return false;
      }
       if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return false;
       }
       setError('');
      return true;
  };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        try {
          if(isLogin) {
            await login(username, password);
          } else {
              // For MVP, signup does not exist, we just redirect to login
              setIsLogin(true);
          }
        } catch (err) {
            setError(err.message);
          console.error('Authentication error:', err);
        } finally {
          setLoading(false);
        }
  };


  const handleToggleFormType = () => {
        setIsLogin(!isLogin);
        setError('');
        setUsername('');
        setPassword('');
    };



  return (
    <form onSubmit={handleSubmit} className="p-4  bg-gray-100 rounded flex flex-col w-full sm:w-96">
      <h2 className="text-2xl text-black font-bold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
        {!isLogin && (<div className="mb-2 text-black">
            Signup is not supported in this MVP
        </div>)}
      <div className="mb-2">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username:
          </label>
        <Input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{width: '100%'}}
          disabled={loading}
        />
      </div>
      <div className="mb-2">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password:
          </label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{width: '100%'}}
           disabled={loading}
        />
      </div>
        {error && <div className="text-red-500 my-2">{error}</div>}
        <Button type="submit" style={{backgroundColor:'#4299e1', color:'white'}} disabled={loading}>
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
      </Button>
        <Button type="button" style={{marginTop: '10px'}}  onClick={handleToggleFormType}>
            {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
        </Button>
    </form>
  );
};

export default AuthForm;