const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Todo = require('../models/Todo');

// Get all todos for a user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new todo
router.post('/', [
  auth,
  check('text', 'Task description is required').not().isEmpty(),
  check('category').isIn(['personal', 'work', 'shopping']),
  check('priority').isIn(['low', 'medium', 'high'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { text, category, priority, dueDate } = req.body;

    const todo = new Todo({
      text,
      category,
      priority,
      dueDate,
      user: req.user.id
    });

    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Make sure user owns todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Make sure user owns todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await todo.remove();
    res.json({ message: 'Todo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;