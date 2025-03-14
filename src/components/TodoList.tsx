import React, { useState } from 'react'
import { Plus, MoreVertical, Trash2 } from 'lucide-react'
import TodoItem from './TodoItem'
import { Todo, TodoList as TodoListType } from '../types'

interface TodoListProps {
  list: TodoListType
  onAddTodo: (listId: string, todo: Todo) => void
  onDeleteList: (listId: string) => void
  onUpdateListTitle: (listId: string, newTitle: string) => void
  toggleTodo: (listId: string, todoId: string) => void
  deleteTodo: (listId: string, todoId: string) => void
  editTodo: (listId: string, todoId: string, newText: string, newDueDate: string) => void
  toggleSubItem: (listId: string, todoId: string, subItemId: string) => void
  formatDate: (date: Date) => string
  getStatus: (dueDate: Date) => 'overdue' | 'due' | 'upcoming'
  getStatusColor: (status: 'overdue' | 'due' | 'upcoming') => string
}

const TodoList: React.FC<TodoListProps> = ({
  list,
  onAddTodo,
  onDeleteList,
  onUpdateListTitle,
  toggleTodo,
  deleteTodo,
  editTodo,
  toggleSubItem,
  formatDate,
  getStatus,
  getStatusColor
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(list.title)

  const handleTitleClick = () => {
    setIsEditingTitle(true)
  }

  const handleTitleSave = () => {
    if (titleInput.trim()) {
      onUpdateListTitle(list.id, titleInput)
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    }
  }

  const handleAddTodo = () => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: 'Nova tarefa',
      completed: false,
      dueDate: new Date(),
      completionDate: null,
      subItems: []
    }
    onAddTodo(list.id, newTodo)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 min-w-[300px] max-w-[350px] flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            autoFocus
            className="font-bold text-lg border-b-2 border-blue-500 focus:outline-none"
          />
        ) : (
          <h2 
            className="font-bold text-lg cursor-pointer hover:text-blue-600" 
            onClick={handleTitleClick}
          >
            {list.title}
          </h2>
        )}
        
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <MoreVertical size={18} />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onDeleteList(list.id)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  <Trash2 size={16} className="mr-2" />
                  Excluir lista
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto space-y-3 mb-4">
        {list.todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={(todoId) => toggleTodo(list.id, todoId)}
            deleteTodo={(todoId) => deleteTodo(list.id, todoId)}
            editTodo={(todoId, newText, newDueDate) => editTodo(list.id, todoId, newText, newDueDate)}
            toggleSubItem={(todoId, subItemId) => toggleSubItem(list.id, todoId, subItemId)}
            formatDate={formatDate}
            getStatus={getStatus}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>
      
      <button
        onClick={handleAddTodo}
        className="flex items-center justify-center w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
      >
        <Plus size={18} className="mr-1" />
        Adicionar tarefa
      </button>
    </div>
  )
}

export default TodoList
