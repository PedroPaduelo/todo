import React, { useState, useEffect } from 'react'
import { Trash2, Edit, Check, X, Calendar, Plus } from 'lucide-react'

interface SubItem {
  id: string
  text: string
  completed: boolean
}

interface Todo {
  id: string
  text: string
  completed: boolean
  dueDate: Date
  completionDate: Date | null
  subItems: SubItem[]
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTodoText, setNewTodoText] = useState('')
  const [newTodoDueDate, setNewTodoDueDate] = useState(formatDate(new Date()))
  const [newTodoSubItems, setNewTodoSubItems] = useState<string[]>([])
  const [currentSubItemInput, setCurrentSubItemInput] = useState('')

  useEffect(() => {
    // Add test todos
    const testTodos: Todo[] = [
      {
        id: '1',
        text: 'Overdue task',
        completed: false,
        dueDate: new Date(Date.now() - 86400000),
        completionDate: null,
        subItems: [{ id: '1-1', text: 'Sub-item 1', completed: false }],
      },
      {
        id: '2',
        text: 'Task due today',
        completed: false,
        dueDate: new Date(),
        completionDate: null,
        subItems: [],
      },
      {
        id: '3',
        text: 'Upcoming task',
        completed: false,
        dueDate: new Date(Date.now() + 86400000),
        completionDate: null,
        subItems: [],
      },
      {
        id: '4',
        text: 'Completed task',
        completed: true,
        dueDate: new Date(),
        completionDate: new Date(),
        subItems: [],
      },
    ]
    setTodos(testTodos)
  }, [])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setTodos([
      ...todos,
      {
        id: Date.now().toString(),
        text: input.trim(),
        completed: false,
        dueDate: new Date(dueDate),
        completionDate: null,
        subItems: [],
      },
    ])
    setInput('')
    setDueDate(formatDate(new Date()))
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completionDate: !todo.completed ? new Date() : null,
            }
          : todo,
      ),
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const editTodo = (id: string, newText: string, newDueDate: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: newText, dueDate: new Date(newDueDate) } : todo,
      ),
    )
  }

  const toggleSubItem = (todoId: string, subItemId: string) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subItems: todo.subItems.map(subItem =>
              subItem.id === subItemId ? { ...subItem, completed: !subItem.completed } : subItem,
            ),
          }
        }
        return todo
      }),
    )
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setNewTodoText('')
    setNewTodoDueDate(formatDate(new Date()))
    setNewTodoSubItems([])
    setCurrentSubItemInput('')
  }

  const handleAddNewTodo = () => {
    if (!newTodoText.trim()) return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
      dueDate: new Date(newTodoDueDate),
      completionDate: null,
      subItems: newTodoSubItems.map((subItemText, index) => ({
        id: `${Date.now().toString()}-${index}`,
        text: subItemText.trim(),
        completed: false,
      })),
    }

    setTodos([...todos, newTodo])
    handleCloseModal()
  }

  const handleAddSubItem = () => {
    if (currentSubItemInput.trim()) {
      setNewTodoSubItems([...newTodoSubItems, currentSubItemInput.trim()])
      setCurrentSubItemInput('')
    }
  }

  const handleDeleteSubItem = (index: number) => {
    const updatedSubItems = [...newTodoSubItems]
    updatedSubItems.splice(index, 1)
    setNewTodoSubItems(updatedSubItems)
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

          <div className="flex justify-end">
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2 inline-block" /> Add Todo
            </button>
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Todo</h3>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Todo text"
                      value={newTodoText}
                      onChange={e => setNewTodoText(e.target.value)}
                      className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={newTodoDueDate}
                      onChange={e => setNewTodoDueDate(e.target.value)}
                      className="mt-2 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="mt-2">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Sub-items:</label>
                      <ul>
                        {newTodoSubItems.map((subItem, index) => (
                          <li key={index} className="flex items-center justify-between py-1">
                            <span>{subItem}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubItem(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Add sub-item"
                          value={currentSubItemInput}
                          onChange={e => setCurrentSubItemInput(e.target.value)}
                          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                        />
                        <button
                          type="button"
                          onClick={handleAddSubItem}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="items-center px-4 py-3">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onClick={handleAddNewTodo}
                  >
                    Add Todo
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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
                      <span className="text-xs">Due: {formatDate(todo.dueDate)}</span>
                      {todo.completionDate && (
                        <span className="text-xs">Completed: {formatDate(todo.completionDate)}</span>
                      )}
                      {todo.subItems.length > 0 && (
                        <div className="mt-2">
                          {todo.subItems.map(subItem => (
                            <div key={subItem.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={subItem.completed}
                                onChange={() => toggleSubItem(todo.id, subItem.id)}
                                className="mr-2"
                              />
                              <span className={`text-xs ${subItem.completed ? 'line-through' : ''}`}>
                                {subItem.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
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
