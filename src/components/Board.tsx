import React from 'react'
import { Plus } from 'lucide-react'
import TodoList from './TodoList'
import { Todo, TodoList as TodoListType } from '../types'

interface BoardProps {
  lists: TodoListType[]
  onAddList: () => void
  onAddTodo: (listId: string) => void
  onDeleteList: (listId: string) => void
  onUpdateListTitle: (listId: string, newTitle: string) => void
  toggleTodo: (listId: string, todoId: string) => void
  deleteTodo: (listId: string, todoId: string) => void
  editTodo: (listId: string, todo: Todo) => void
  toggleSubItem: (listId: string, todoId: string, subItemId: string) => void
  formatDate: (date: Date) => string
  getStatus: (dueDate: Date) => 'overdue' | 'due' | 'upcoming'
  getStatusColor: (status: 'overdue' | 'due' | 'upcoming') => string
}

const Board: React.FC<BoardProps> = ({
  lists,
  onAddList,
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
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quadro de Tarefas</h1>
        <button
          onClick={onAddList}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Nova Lista
        </button>
      </div>
      
      <div className="flex-grow overflow-x-auto">
        <div className="flex gap-6 h-full pb-4">
          {lists.map(list => (
            <TodoList
              key={list.id}
              list={list}
              onAddTodo={onAddTodo}
              onDeleteList={onDeleteList}
              onUpdateListTitle={onUpdateListTitle}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
              toggleSubItem={toggleSubItem}
              formatDate={formatDate}
              getStatus={getStatus}
              getStatusColor={getStatusColor}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Board
