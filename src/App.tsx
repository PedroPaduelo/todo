import React, { useState } from 'react'
    import { Trash2, Edit, Check, X } from 'lucide-react'

    interface Todo {
      id: string
      text: string
      completed: boolean
    }

    export default function App() {
      const [todos, setTodos] = useState<Todo[]>([])
      const [input, setInput] = useState('')

      const addTodo = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return
        setTodos([...todos, { id: Date.now().toString(), text: input.trim(), completed: false }])
        setInput('')
      }

      const toggleTodo = (id: string) => {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
      }

      const deleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id))
      }

      const editTodo = (id: string, newText: string) => {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, text: newText } : todo
        ))
      }

      return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
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
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {todos.map(todo => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-4 bg-gray-50 rounded-md transition-all ${
                      todo.completed ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="text-gray-500 hover:text-green-600 transition-colors"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <span
                        className={`text-sm ${todo.completed ? 'text-green-600 line-through' : 'text-gray-700'}`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editTodo(todo.id, prompt('Edit todo:', todo.text) || todo.text)}
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
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }
