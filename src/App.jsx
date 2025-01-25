import { useState, useEffect } from 'react'
import './App.css'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [category, setCategory] = useState('personal')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      category,
      dueDate,
      priority,
      createdAt: new Date().toISOString()
    }
    
    setTodos([...todos, newTodo])
    setInputValue('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'completed') return todo.completed
      if (filter === 'active') return !todo.completed
      return true
    })
    .filter(todo =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    )

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      <div className="controls">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="search-input"
        />
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="add-button"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="shopping">Shopping</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="todo-input"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="filter-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit" className="add-button">Add Task</button>
      </form>
      <AnimatePresence>
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <motion.li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <div className="todo-details">
                <span className="todo-text">{todo.text}</span>
                <div className="todo-meta">
                  <span>{todo.category}</span>
                  {todo.dueDate && (
                    <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                  )}
                  <span className={`priority-badge priority-${todo.priority}`}>
                    {todo.priority}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </div>
  )
}

export default App
