import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch('https://todo-app-7hw4.onrender.com/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch('https://todo-app-7hw4.onrender.com/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      
      // Reset form
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await fetch(`https://todo-app-7hw4.onrender.com/api/tasks/${id}`, {
        method: 'DELETE',
      });

      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-500 text-white text-center py-4">
          <h1 className="text-2xl font-bold">Todo List</h1>
        </div>

        {/* Task Input Form */}
        <form onSubmit={handleAddTask} className="p-6 space-y-4">
          <input 
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description (Optional)"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="2"
          />
          <button 
            type="submit" 
            className="w-full flex items-center justify-center bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            <PlusCircle className="mr-2" /> Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="divide-y divide-gray-200">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition duration-200"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-500 text-sm">{task.description}</p>
                )}
              </div>
              <button 
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 hover:text-red-700 transition duration-300"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            No tasks yet. Add a task to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;