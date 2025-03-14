import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Board from './components/Board'
import { Todo, TodoList, AppState } from './types'
import { saveToLocalStorage, getInitialState } from './utils/localStorage'

const formatDate = (date: Date): string => {
  // Verificar se date é uma instância de Date
  if (!(date instanceof Date)) {
    // Se não for, tentar converter para Date
    date = new Date(date);
  }
  
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Erro ao formatar data:', error, date);
    // Retornar uma data padrão em caso de erro
    return new Date().toISOString().split('T')[0];
  }
}

const getStatus = (dueDate: Date): 'overdue' | 'due' | 'upcoming' => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Garantir que dueDate seja uma instância de Date
  const due = dueDate instanceof Date ? new Date(dueDate) : new Date(dueDate);
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
  const [appState, setAppState] = useState<AppState>(getInitialState)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTodoText, setNewTodoText] = useState('')
  const [newTodoDueDate, setNewTodoDueDate] = useState(formatDate(new Date()))
  const [newTodoSubItems, setNewTodoSubItems] = useState<string[]>([])
  const [currentSubItemInput, setCurrentSubItemInput] = useState('')
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  // Salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    saveToLocalStorage(appState)
  }, [appState])

  const addList = () => {
    const newList: TodoList = {
      id: Date.now().toString(),
      title: 'Nova Lista',
      todos: []
    }
    
    setAppState(prevState => ({
      ...prevState,
      lists: [...prevState.lists, newList]
    }))
  }

  const deleteList = (listId: string) => {
    setAppState(prevState => ({
      ...prevState,
      lists: prevState.lists.filter(list => list.id !== listId)
    }))
  }

  const updateListTitle = (listId: string, newTitle: string) => {
    setAppState(prevState => ({
      ...prevState,
      lists: prevState.lists.map(list => 
        list.id === listId ? { ...list, title: newTitle } : list
      )
    }))
  }

  const addTodo = (listId: string, todo: Todo) => {
    setAppState(prevState => ({
      ...prevState,
      lists: prevState.lists.map(list => 
        list.id === listId 
          ? { ...list, todos: [...list.todos, todo] } 
          : list
      )
    }))
  }

  const toggleTodo = (listId: string, todoId: string) => {
    setAppState(prevState => ({
      ...prevState,
      lists: prevState.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            todos: list.todos.map(todo => 
              todo.id === todoId
                ? {
                    ...todo,
                    completed: !todo.completed,
                    completionDate: !todo.completed ? new Date() : null,
                  }
                : todo
            )
          }
        }
        return list
      })
    }))
  }

  const deleteTodo = (listId: string, todoId: string) => {
    setAppState(prevState => ({
      ...prevState,
      lists: prevState.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            todos: list.todos.filter(todo => todo.id !== todoId)
          }
        }
        return list
      })
    }))
  }

  const editTodo = (listId: string, todoId: string, newText: string, newDueDate: string) => {
    setAppState(prevState => ({
      ...prevState,
      lists: prevState.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            todos: list.todos.map(todo =>
              todo.id === todoId 
                ? { ...todo, text: newText, dueDate: new Date(newDueDate) } 
                : todo
            )
          }
        }
        return list
      })
    }))
  }

  const toggleSubItem = (listId: string, todoId: string, subItemId: string) => {
    setAppState(prevState => ({
      ...prevState,
      lists: prevState.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            todos: list.todos.map(todo => {
              if (todo.id === todoId) {
                return {
                  ...todo,
                  subItems: todo.subItems.map(subItem =>
                    subItem.id === subItemId 
                      ? { ...subItem, completed: !subItem.completed } 
                      : subItem
                  )
                }
              }
              return todo
            })
          }
        }
        return list
      })
    }))
  }

  const handleOpenModal = (listId: string) => {
    setSelectedListId(listId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setNewTodoText('')
    setNewTodoDueDate(formatDate(new Date()))
    setNewTodoSubItems([])
    setCurrentSubItemInput('')
    setSelectedListId(null)
  }

  const handleAddNewTodo = () => {
    if (!newTodoText.trim() || !selectedListId) return

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

    addTodo(selectedListId, newTodo)
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
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow">
        <div className="bg-white rounded-lg shadow-xl p-6 h-full">
          <Board
            lists={appState.lists}
            onAddList={addList}
            onAddTodo={addTodo}
            onDeleteList={deleteList}
            onUpdateListTitle={updateListTitle}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleSubItem={toggleSubItem}
            formatDate={formatDate}
            getStatus={getStatus}
            getStatusColor={getStatusColor}
          />
        </div>
      </div>

      {/* Modal para adicionar nova tarefa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Adicionar Nova Tarefa</h3>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Texto da tarefa"
                  value={newTodoText}
                  onChange={e => setNewTodoText(e.target.value)}
                  className="mt-1 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  value={newTodoDueDate}
                  onChange={e => setNewTodoDueDate(e.target.value)}
                  className="mt-2 px-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <div className="mt-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Sub-tarefas:</label>
                  <ul>
                    {newTodoSubItems.map((subItem, index) => (
                      <li key={index} className="flex items-center justify-between py-1">
                        <span>{subItem}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubItem(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Adicionar sub-tarefa"
                      value={currentSubItemInput}
                      onChange={e => setCurrentSubItemInput(e.target.value)}
                      className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubItem}
                      className="px-4 py-2 font-semibold text-white bg-indigo-500 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="items-center px-4 py-3 flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={handleAddNewTodo}
              >
                Adicionar
              </button>
              <button
                className="px-4 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
