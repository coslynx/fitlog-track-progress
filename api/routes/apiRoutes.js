const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const goalController = require('../controllers/goalController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for user signup
router.post('/auth/signup', authController.signup);

// Route for user login
router.post('/auth/login', authController.login);


// Apply authMiddleware to all routes under /goals
router.use('/goals', authMiddleware.verifyToken);

// Route to get all goals for the authenticated user
router.get('/goals', goalController.getAllGoals);

// Route to create a new goal for the authenticated user
router.post('/goals', goalController.createGoal);

// Route to update an existing goal for the authenticated user
router.put('/goals/:id', goalController.updateGoal);

// Route to delete an existing goal for the authenticated user
router.delete('/goals/:id', goalController.deleteGoal);

module.exports = router;