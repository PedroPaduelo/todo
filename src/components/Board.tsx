import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import TodoList from './TodoList'
import { Todo, TodoList as TodoListType } from '../types'

interface BoardProps {
  lists: TodoListType[]
  onAddList: () => void
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meu Quadro de Tarefas</h1>
        <button
          onClick={onAddList}
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Nova Lista
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
          
          <div className="min-w-[250px] flex items-start">
            <button
              onClick={onAddList}
              className="w-full p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <Plus className="h-5 w-5 mr-2 text-gray-500" />
              <span className="text-gray-500 font-medium">Adicionar Lista</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Board
