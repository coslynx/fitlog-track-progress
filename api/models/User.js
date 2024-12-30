const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @typedef {Object} User
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 * @property {string} _id - The unique identifier of the user
 * @property {Date} createdAt - The date the user was created
 * @property {Date} updatedAt - The date the user was updated
 */


/**
 * Mongoose schema for the User model.
 * @type {mongoose.Schema<User>}
 */
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required.'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters long.'],
            maxlength: [30, 'Username cannot exceed 30 characters.'],
            index: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true,
            lowercase: true,
            match: [
                /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                'Please enter a valid email address.',
            ],
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
            minlength: [8, 'Password must be at least 8 characters long.'],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
        toJSON: {
            transform: function (_doc, ret) {
                delete ret.password;
                return ret;
            }
        }
    }
);

/**
 * Pre-save middleware to hash the password using bcrypt.
 * This ensures that passwords are never stored in plain text.
 */
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


/**
 * Method to compare a provided password with the user's hashed password.
 * @param {string} password - The plain text password to compare.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, false otherwise.
 */
UserSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

/**
 * Mongoose model for the User collection.
 * @type {mongoose.Model<User>}
 */
const User = mongoose.model('User', UserSchema);

module.exports = User;