import React from 'react'
import { Trash2, Edit, Check } from 'lucide-react'

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

interface TodoItemProps {
  todo: Todo
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  editTodo: (id: string, newText: string, newDueDate: string) => void
  toggleSubItem: (todoId: string, subItemId: string) => void
  formatDate: (date: Date) => string
  getStatus: (dueDate: Date) => 'overdue' | 'due' | 'upcoming'
  getStatusColor: (status: 'overdue' | 'due' | 'upcoming') => string
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodo,
  deleteTodo,
  editTodo,
  toggleSubItem,
  formatDate,
  getStatus,
  getStatusColor,
}) => {
  const status = getStatus(todo.dueDate)
  const statusColor = getStatusColor(status)

  return (
    <div
      className={`flex items-center justify-between p-5 rounded-md shadow-md transition-all ${statusColor} ${
        todo.completed ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => toggleTodo(todo.id)}
          className="text-gray-500 hover:text-green-600 transition-colors"
        >
          <Check className={`w-6 h-6 ${todo.completed ? 'text-green-600' : ''}`} />
        </button>
        <div className="flex flex-col">
          <span className={`text-lg font-semibold ${todo.completed ? 'line-through' : ''}`}>
            {todo.text}
          </span>
          <span className="text-sm text-gray-500">Due: {formatDate(todo.dueDate)}</span>
          {todo.completionDate && (
            <span className="text-sm text-gray-500">Completed: {formatDate(todo.completionDate)}</span>
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
                  <span className={`text-sm ${subItem.completed ? 'line-through' : ''}`}>
                    {subItem.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const newText = prompt('Edit task:', todo.text)
            const newDueDate = prompt('Edit due date:', formatDate(todo.dueDate))
            if (newText && newDueDate) {
              editTodo(todo.id, newText, newDueDate)
            }
          }}
          className="text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="text-gray-500 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default TodoItem
