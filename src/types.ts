export interface SubItem {
  id: string
  text: string
  completed: boolean
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  dueDate: Date
  completionDate: Date | null
  subItems: SubItem[]
}

export interface TodoList {
  id: string
  title: string
  todos: Todo[]
}

export interface AppState {
  lists: TodoList[]
}
