import React from 'react';

/**
 * @typedef {Object} Goal
 * @property {string} id - The unique identifier for the goal.
 * @property {string} name - The name of the goal.
 * @property {number} progress - The current progress of the goal.
 * @property {number} target - The target value for the goal.
 * @property {string} createdAt - The date when the goal was created.
 */

/**
 * A component that displays a single goal item.
 * @param {{goal: Goal | null}} props
 * @returns {JSX.Element}
 */
const GoalItem = ({ goal }) => {
    if (!goal) {
        return <div className="p-4 bg-white rounded shadow-md mb-4">No goal data provided.</div>;
    }

    const { name, progress, target, createdAt } = goal;
    const sanitizedName = name ? name.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "No Name";
    let progressPercentage = 0;

    if (typeof progress === 'number' && typeof target === 'number' && target > 0) {
        progressPercentage = Math.min(Math.max((progress / target) * 100, 0), 100);
    }

    let formattedDate = "Invalid date";
    if (createdAt) {
      try {
        const date = new Date(createdAt);
        formattedDate = date.toLocaleDateString();
      } catch (e) {
        console.error("Invalid date:", createdAt);
      }
    }


    return (
        <div className="p-4 bg-white rounded shadow-md mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{sanitizedName}</h3>
            <div className="text-gray-600">Progress: {progressPercentage.toFixed(0)}%</div>
          <div className="bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-500 rounded-full h-2"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
            <div className="text-gray-500 text-sm">Created at: {formattedDate}</div>
        </div>
    );
};

export default GoalItem;