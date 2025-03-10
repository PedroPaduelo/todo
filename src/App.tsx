import React, { useState, useEffect } from 'react'
import { Trash2, Edit, Check, X, Calendar } from 'lucide-react'

interface Todo {
  id: string
  text: string
  completed: boolean
  dueDate: Date
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getStatus = (dueDate: Date): 'overdue' | 'due' | 'upcoming' => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)

  if (due < today) return 'overdue'
  if (due.getTime() === today.getTime()) return 'due'
  return 'upcoming'
}

const getStatusColor = (status: 'overdue' | 'due' | 'upcoming'): string => {
  switch (status) {
    case 'overdue':
      return 'bg-red-100 text-red-800'
    case 'due':
      return 'bg-orange-100 text-orange-800'
    case 'upcoming':
      return 'bg-gray-100 text-gray-800'
  }
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState(formatDate(new Date()))

  useEffect(() => {
    // Add test todos
    const testTodos: Todo[] = [
      { id: '1', text: 'Overdue task', completed: false, dueDate: new Date(Date.now() - 86400000) },
      { id: '2', text: 'Task due today', completed: false, dueDate: new Date() },
      { id: '3', text: 'Upcoming task', completed: false, dueDate: new Date(Date.now() + 86400000) },
      { id: '4', text: 'Completed task', completed: true, dueDate: new Date() },
    ]
    setTodos(testTodos)
  }, [])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now().toString(), text: input.trim(), completed: false, dueDate: new Date(dueDate) }])
    setInput('')
    setDueDate(formatDate(new Date()))
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const editTodo = (id: string, newText: string, newDueDate: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText, dueDate: new Date(newDueDate) } : todo
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Todo List
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({todos.filter(todo => !todo.completed).length} active)
            </span>
          </h1>
          
          <form onSubmit={addTodo} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a new todo"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {todos.map(todo => {
              const status = getStatus(todo.dueDate)
              const statusColor = getStatusColor(status)
              return (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-4 rounded-md transition-all ${statusColor} ${
                    todo.completed ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="text-gray-500 hover:text-green-600 transition-colors"
                    >
                      <Check className={`w-5 h-5 ${todo.completed ? 'text-green-600' : ''}`} />
                    </button>
                    <div className="flex flex-col">
                      <span className={`text-sm ${todo.completed ? 'line-through' : ''}`}>
                        {todo.text}
                      </span>
                      <span className="text-xs">
                        Due: {formatDate(todo.dueDate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newText = prompt('Edit todo:', todo.text)
                        const newDueDate = prompt('Edit due date:', formatDate(todo.dueDate))
                        if (newText && newDueDate) {
                          editTodo(todo.id, newText, newDueDate)
                        }
                      }}
                      className="text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
