const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// In-memory storage for tasks (replace with database in production)
let tasks = [];

// GET endpoint to fetch all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST endpoint to add a new task
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const newTask = {
    id: Date.now().toString(), // Simple unique ID generation
    title,
    description: description || '',
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// DELETE endpoint to remove a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = tasks.length;
  
  tasks = tasks.filter(task => task.id !== id);

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.status(200).json({ message: 'Task deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;