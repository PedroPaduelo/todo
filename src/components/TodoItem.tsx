import React from 'react'
import { Trash2, Edit, Check } from 'lucide-react'
import { Todo, SubItem } from '../types'

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
      className={`flex items-center justify-between p-3 rounded-md shadow-sm transition-all ${statusColor} ${
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
          <span className={`text-sm font-semibold ${todo.completed ? 'line-through' : ''}`}>
            {todo.text}
          </span>
          <span className="text-xs text-gray-500">Prazo: {formatDate(todo.dueDate)}</span>
          {todo.completionDate && (
            <span className="text-xs text-gray-500">Concluído: {formatDate(todo.completionDate)}</span>
          )}
          {todo.subItems.length > 0 && (
            <div className="mt-1">
              {todo.subItems.map(subItem => (
                <div key={subItem.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={subItem.completed}
                    onChange={() => toggleSubItem(todo.id, subItem.id)}
                    className="mr-1 h-3 w-3"
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
            const newText = prompt('Editar tarefa:', todo.text)
            const newDueDate = prompt('Editar prazo:', formatDate(todo.dueDate))
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
}

export default TodoItem
