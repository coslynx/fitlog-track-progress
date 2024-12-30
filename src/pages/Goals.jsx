import React, { useState, useEffect, useCallback } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import useApi from '../hooks/useApi';

/**
 * @typedef {Object} Goal
 * @property {string} id - The unique identifier for the goal.
 * @property {string} name - The name of the goal.
 * @property {number} progress - The current progress of the goal.
 * @property {number} target - The target value for the goal.
 * @property {string} createdAt - The date when the goal was created.
 */

/**
 * Goals component
 *
 * This component allows users to view, create, update, and delete their fitness goals.
 * It uses the useApi hook to interact with the backend API and manages its own state
 * for goals, loading, error, and modal visibility. It includes comprehensive
 * error handling, loading states, input sanitization, and uses Tailwind CSS for styling.
 *
 * Test Cases:
 * 1. Loading and error handling: Check for loading and error messages when data is fetching
 *    or if the API fails.
 * 2. Data rendering: Check if the goals are rendered correctly if the fetch is successful.
 * 3. Goal creation: Check if a new goal is created after submitting the form.
 * 4. Goal update: Check if the modal is rendered correctly when the update button is clicked.
 * 5. Goal deletion: Verify if the goal is deleted as expected after clicking the delete button.
 */
const Goals = () => {
    const { get, post, put, delete: del } = useApi();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newGoalName, setNewGoalName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editGoalId, setEditGoalId] = useState<string | null>(null);
    const [editGoalName, setEditGoalName] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);

    const fetchGoals = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await get('/goals');
            setGoals(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [get]);

    useEffect(() => {
      fetchGoals();
    }, [fetchGoals]);


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewGoalName('');
        setEditGoalId(null);
        setEditGoalName('');
         setShowDeleteConfirmation(false);
        setDeleteGoalId(null)
    };

    const handleCreateGoal = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!newGoalName.trim()) {
           setError('Goal name cannot be empty');
          return;
        }
        const sanitizedNewGoalName = newGoalName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        try {
            setLoading(true);
            setError(null);
            const newGoal = await post('/goals', { name: sanitizedNewGoalName });
            setGoals((prevGoals) => [...prevGoals, newGoal]);
            handleCloseModal();
           setNewGoalName('');
        } catch (err: any) {
            setError(err.message);
        } finally {
          setLoading(false);
        }
    };


  const handleOpenEditModal = (goalId: string, goalName: string) => {
      setEditGoalId(goalId);
    setEditGoalName(goalName);
      setIsModalOpen(true)
  };

  const handleUpdateGoal = async (event: React.FormEvent) => {
        event.preventDefault();
       if (!editGoalName.trim()) {
            setError('Goal name cannot be empty');
            return;
        }
      const sanitizedEditGoalName = editGoalName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        try {
            setLoading(true);
           setError(null);
          const updatedData = await put(`/goals/${editGoalId}`, { name: sanitizedEditGoalName });
          setGoals((prevGoals) => prevGoals.map(goal => goal.id === editGoalId ? updatedData : goal));
            handleCloseModal();
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false);
        }
  };
  const handleOpenDeleteModal = (goalId: string) => {
      setDeleteGoalId(goalId);
      setShowDeleteConfirmation(true);
      setIsModalOpen(true);
  };


  const handleDeleteGoal = async () => {
        try {
            setLoading(true);
            setError(null);
            await del(`/goals/${deleteGoalId}`);
            setGoals(goals.filter(goal => goal.id !== deleteGoalId));
          handleCloseModal();
        } catch (err: any) {
           setError(err.message);
        } finally {
            setLoading(false);
        }
    };


  if (loading) {
        return <div className="container p-4 flex flex-col items-center justify-start min-h-screen bg-gray-100"><div className="text-gray-500 my-2">Loading goals...</div></div>;
    }


    return (
      <div className="container p-4 flex flex-col items-center justify-start min-h-screen bg-gray-100">
        <h2 className="text-2xl text-gray-800 font-bold mb-4">Goals</h2>
        {error && <div className="text-red-500 my-2">{error}</div>}
          <Button onClick={handleOpenModal} style={{marginBottom: '10px'}}>Add Goal</Button>
        <div className="w-full max-w-2xl mt-4">
            {goals && goals.length > 0 ? (
              goals.map((goal) => {
                  const sanitizedGoalName = goal.name ? goal.name.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "No Name";
                  return (
                      <div key={goal.id} className="p-4 bg-white rounded shadow-md mb-4 flex items-center justify-between">
                          <p className="text-gray-800 text-xl font-semibold">{sanitizedGoalName}</p>
                          <div className="flex space-x-2">
                              <Button onClick={() => handleOpenEditModal(goal.id, goal.name)} style={{backgroundColor: '#4299e1', color: 'white', padding: '5px 10px'}}>Edit</Button>
                              <Button onClick={() => handleOpenDeleteModal(goal.id)} style={{backgroundColor: '#e53e3e', color: 'white', padding: '5px 10px'}}>Delete</Button>
                         </div>
                      </div>
                  )
              })
            ) : (
                !loading && <div className="text-gray-500 my-2">No goals found</div>
            )}

        </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {showDeleteConfirmation ? (
                    <div className="p-4 flex flex-col items-center">
                        <p className="text-gray-800 text-xl mb-4">Are you sure you want to delete this goal?</p>
                        <div className="flex space-x-4">
                            <Button style={{backgroundColor: '#4299e1', color: 'white'}} onClick={handleDeleteGoal}>Confirm</Button>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                        </div>

                    </div>
                ) : editGoalId ? (
                    <form onSubmit={handleUpdateGoal} className="p-4 flex flex-col">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Goal</h2>
                        <div className="mb-4">
                            <label htmlFor="editGoalName" className="block text-gray-700 text-sm font-bold mb-2">
                                Goal Name:
                            </label>
                            <Input
                                type="text"
                                placeholder="Enter updated goal name"
                                value={editGoalName}
                                onChange={(e) => setEditGoalName(e.target.value)}
                                style={{width: '100%'}}
                            />
                        </div>
                        <Button type="submit" style={{backgroundColor: '#4299e1', color: 'white'}}>Update Goal</Button>
                    </form>
                ) : (
                  <form onSubmit={handleCreateGoal} className="p-4 flex flex-col">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Goal</h2>
                      <div className="mb-4">
                          <label htmlFor="newGoalName" className="block text-gray-700 text-sm font-bold mb-2">
                              Goal Name:
                          </label>
                          <Input
                            type="text"
                            placeholder="Enter goal name"
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            style={{width: '100%'}}
                          />
                        </div>
                      <Button type="submit" style={{backgroundColor: '#4299e1', color: 'white'}}>Create Goal</Button>
                  </form>
                )}

            </Modal>
      </div>
    );
};

export default Goals;