const Goal = require('../models/Goal');
const User = require('../models/User');

/**
 * Asynchronous function to retrieve all goals for a specific user.
 * @param {Object} req - Express request object with `req.user` populated by `authMiddleware.js` containing the user ID.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const getAllGoals = async (req, res) => {
    try {
        const userId = req.user.id;

        const goals = await Goal.find({ userId });

        if (!goals || goals.length === 0) {
            return res.status(404).json({ message: 'No goals found for this user' });
        }

        return res.status(200).json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


/**
 * Asynchronous function to create a new goal for a specific user.
 * @param {Object} req - Express request object with `req.user` populated by `authMiddleware.js` containing the user ID and `req.body` containing goal data.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const createGoal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, type, startDate, endDate, targetValue, unit } = req.body;

         // Input validation with mongoose schema validation
        const newGoal = new Goal({
            userId,
            name,
            description,
            type,
            startDate,
            endDate,
            targetValue,
            unit,
        });

       await newGoal.validate();
       await newGoal.save();


        return res.status(201).json(newGoal);
    } catch (error) {
        console.error('Error creating goal:', error);
        if(error.name === 'ValidationError') {
           return res.status(400).json({ message: 'Invalid input data', errors: error.errors})
        }
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

/**
 * Asynchronous function to update an existing goal for a specific user.
 * @param {Object} req - Express request object with `req.user` populated by `authMiddleware.js` containing the user ID, `req.params.id` containing the goal ID, and `req.body` containing updated goal data.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const updateGoal = async (req, res) => {
    try {
        const userId = req.user.id;
        const goalId = req.params.id;
        const { name, description, type, startDate, endDate, targetValue, unit } = req.body;

        // Validate data against schema
        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: goalId, userId },
            { name, description, type, startDate, endDate, targetValue, unit },
            { new: true, runValidators: true }
        );



        if (!updatedGoal) {
            return res.status(404).json({ message: 'Goal not found' });
        }


        return res.status(200).json(updatedGoal);
    } catch (error) {
        console.error('Error updating goal:', error);
        if(error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid input data', errors: error.errors})
        }
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


/**
 * Asynchronous function to delete an existing goal for a specific user.
 * @param {Object} req - Express request object with `req.user` populated by `authMiddleware.js` containing the user ID, and `req.params.id` containing the goal ID.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
const deleteGoal = async (req, res) => {
    try {
        const userId = req.user.id;
        const goalId = req.params.id;

        const deletedGoal = await Goal.findOneAndDelete({ _id: goalId, userId });

        if (!deletedGoal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting goal:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



module.exports = {
    getAllGoals,
    createGoal,
    updateGoal,
    deleteGoal,
};