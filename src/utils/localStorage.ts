import { AppState, TodoList } from '../types'

// Função para serializar datas antes de salvar no localStorage
const replacer = (_key: string, value: any) => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() }
  }
  return value
}

// Função para deserializar datas ao ler do localStorage
const reviver = (_key: string, value: any) => {
  if (value && typeof value === 'object' && value.__type === 'Date') {
    return new Date(value.value)
  }
  return value
}

export const saveToLocalStorage = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state, replacer)
    localStorage.setItem('taskmaster-state', serializedState)
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error)
  }
}

export const loadFromLocalStorage = (): AppState | null => {
  try {
    const serializedState = localStorage.getItem('taskmaster-state')
    if (!serializedState) return null
    
    // Parse com reviver para converter objetos de data de volta para instâncias de Date
    const parsedState = JSON.parse(serializedState, reviver)
    
    // Garantir que todas as datas sejam instâncias de Date
    if (parsedState && parsedState.lists) {
      parsedState.lists.forEach((list: TodoList) => {
        if (list.todos) {
          list.todos.forEach(todo => {
            // Garantir que dueDate seja uma instância de Date
            if (todo.dueDate && !(todo.dueDate instanceof Date)) {
              todo.dueDate = new Date(todo.dueDate);
            }
            
            // Garantir que completionDate seja uma instância de Date ou null
            if (todo.completionDate && !(todo.completionDate instanceof Date)) {
              todo.completionDate = new Date(todo.completionDate);
            }
          });
        }
      });
    }
    
    return parsedState;
  } catch (error) {
    console.error('Erro ao carregar do localStorage:', error)
    return null
  }
}

export const getInitialState = (): AppState => {
  const savedState = loadFromLocalStorage()
  
  if (savedState) {
    return savedState
  }
  
  // Estado inicial padrão se não houver dados salvos
  const defaultList: TodoList = {
    id: '1',
    title: 'Tarefas',
    todos: [
      {
        id: '1',
        text: 'Tarefa atrasada',
        completed: false,
        dueDate: new Date(Date.now() - 86400000),
        completionDate: null,
        subItems: [{ id: '1-1', text: 'Sub-item 1', completed: false }],
      },
      {
        id: '2',
        text: 'Tarefa para hoje',
        completed: false,
        dueDate: new Date(),
        completionDate: null,
        subItems: [],
      },
      {
        id: '3',
        text: 'Tarefa futura',
        completed: false,
        dueDate: new Date(Date.now() + 86400000),
        completionDate: null,
        subItems: [],
      },
      {
        id: '4',
        text: 'Tarefa concluída',
        completed: true,
        dueDate: new Date(),
        completionDate: new Date(),
        subItems: [],
      },
    ]
  }

  return {
    lists: [defaultList]
  }
}
