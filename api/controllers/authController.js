const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * Asynchronous function to handle user signup.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input data using mongoose model validation and custom validation logic
        if (!username || typeof username !== 'string' || username.trim().length < 3) {
          return res.status(400).json({ message: 'Username is required and must be at least 3 characters long' });
        }

        if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
          return res.status(400).json({ message: 'Email is required and must be a valid email address' });
        }

        if (!password || typeof password !== 'string' || password.trim().length < 8) {
          return res.status(400).json({ message: 'Password is required and must be at least 8 characters long' });
        }


        // Check if user with the same username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the password using bcrypt with a salt factor of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document in the database
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();


        // Respond with 201 status and user data (excluding password)
       const userResponse = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
        };
        return res.status(201).json({ message: 'User created successfully', user: userResponse });


    } catch (error) {
      console.error('Error during user signup:', error);
      return res.status(500).json({ message: 'Internal Server Error' , error: error.message});
    }
};


/**
 * Asynchronous function to handle user login.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

         // Validate presence of username and password
        if (!username || typeof username !== 'string' || username.trim().length < 3 ) {
            return res.status(400).json({ message: 'Username is required and must be at least 3 characters long' });
        }

        if (!password || typeof password !== 'string' || password.trim().length < 8 ) {
            return res.status(400).json({ message: 'Password is required and must be at least 8 characters long' });
        }



        // Find the user in the database by username
        const user = await User.findOne({ username });


        // If no user is found, return 401 Unauthorized
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }


        // Compare the provided password with the user's hashed password
        const passwordMatch = await user.comparePassword(password);

        // If passwords do not match, return 401 Unauthorized
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

       // Generate a JWT token with user id as payload and 1 hour expiration time
       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });


       const userResponse = {
         id: user.id,
         username: user.username,
       };


        // Respond with 200 status and the generated JWT token
       return  res.status(200).json({ token, user: userResponse });


    } catch (error) {
        console.error('Error during user login:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


module.exports = {
    signup,
    login,
};