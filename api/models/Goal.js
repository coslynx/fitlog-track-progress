const mongoose = require('mongoose');

/**
 * @typedef {Object} Progress
 * @property {Date} date - The date of the progress record.
 * @property {number} value - The value of the progress at the given date.
 */

/**
 * @typedef {Object} Goal
 * @property {mongoose.Schema.Types.ObjectId} userId - The ID of the user who created the goal, referencing the User model.
 * @property {string} name - The name of the goal.
 * @property {string} description - An optional description of the goal.
 * @property {string} type - The type of the goal (e.g., 'weight loss', 'muscle gain').
 * @property {Date} startDate - The start date of the goal.
 * @property {Date} endDate - The end date of the goal.
 * @property {number} targetValue - The target value to be achieved for the goal.
 * @property {string} unit - The unit of measure for the target value (e.g., 'kg', 'lbs', 'minutes').
 * @property {Progress[]} progress - An array of progress objects representing user's progress towards the goal.
 * @property {Date} createdAt - The date the goal was created
 * @property {Date} updatedAt - The date the goal was updated
 */


/**
 * Mongoose schema for the Goal model.
 * @type {mongoose.Schema<Goal>}
 */
const GoalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'User ID is required.'],
            ref: 'User',
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Goal name is required.'],
            trim: true,
            minlength: [3, 'Goal name must be at least 3 characters long.'],
            maxlength: [50, 'Goal name cannot exceed 50 characters.'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [200, 'Goal description cannot exceed 200 characters.'],
            default: null,
        },
        type: {
            type: String,
            enum: ['weight loss', 'muscle gain', 'endurance', 'other'],
            required: [true, 'Goal type is required.'],
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required.'],
        },
        endDate: {
            type: Date,
            required: [true, 'End date is required.'],
        },
        targetValue: {
            type: Number,
            required: [true, 'Target value is required.'],
        },
        unit: {
            type: String,
            required: [true, 'Unit of measure is required.'],
        },
        progress: [{
            date: {
                type: Date,
                required: [true, 'Progress date is required.']
            },
            value: {
                type: Number,
                required: [true, 'Progress value is required.']
            },
            _id: false
        }],
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (_doc, ret) {
                delete ret.__v;
                return ret;
            }
        }
    }
);

/**
 * Mongoose model for the Goal collection.
 * @type {mongoose.Model<Goal>}
 */
const Goal = mongoose.model('Goal', GoalSchema);


module.exports = Goal;