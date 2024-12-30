const mongoose = require('mongoose');

/**
 * Establishes a connection to a MongoDB database using Mongoose.
 * This function returns a Promise that resolves when the database connection is successful.
 * It utilizes environment variables for configuration, specifically MONGODB_URI (for the database connection string) and NODE_ENV (for setting the environment).
 * The MONGODB_URI defaults to mongodb://localhost:27017/fitness_app if the environment variable is not set.
 * The function handles potential connection errors by logging an error message to the console and then throwing the error.
 * Implements proper connection management using Mongoose to handle connection events such as connected, error, disconnected, and close, preventing memory leaks.
 * Does not auto-reconnect on disconnect. Uses process.env to access environment variables.
 * If the application is running in development environment, verbose output for connection logs is used, otherwise minimal output.
 * @returns {Promise<void>} A Promise that resolves when the database connection is successful.
 * @throws {Error} If an error occurs during the database connection process.
 */
const connectDB = async () => {
  const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness_app';
    const nodeEnv = process.env.NODE_ENV || 'development';

    try {
        await mongoose.connect(mongodbUri, {
            // Prevents auto-reconnection on disconnect which is not recommended
            autoReconnect: false,
            // Added to avoid deprecation warnings
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        mongoose.connection.on('connected', () => {
          if (nodeEnv === 'development') {
            console.log('Database connected: Connection established successfully');
          }
        });

        mongoose.connection.on('error', (err) => {
            console.error(`Database connection error: ${err.message}`);
            throw err;
        });


        mongoose.connection.on('disconnected', () => {
            if(nodeEnv === 'development') {
                console.log('Database disconnected: Connection was terminated');
            }
        });


        mongoose.connection.on('close', () => {
            if(nodeEnv === 'development') {
                console.log('Database close: Connection was closed');
            }
        });

    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        throw error;
    }
};

module.exports = { connectDB };