import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Todo, TodoFormValues, TodoStatus } from './todo.types';

interface TodosState {
  items: Todo[];
  search: string;
}

export const initialState: TodosState = {
  items: [],
  search: '',
};

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    hydrateTodos(state, action: PayloadAction<Todo[]>) {
      state.items = action.payload;
    },
    addTodo(state, action: PayloadAction<TodoFormValues>) {
      const now = new Date().toISOString();
      state.items.unshift({
        id: createId(),
        title: action.payload.title.trim(),
        description: action.payload.description.trim(),
        status: 'todo',
        createdAt: now,
        updatedAt: now,
      });
    },
    updateTodo(state, action: PayloadAction<{ id: string; values: TodoFormValues }>) {
      const todo = state.items.find((item) => item.id === action.payload.id);
      if (!todo) return;

      todo.title = action.payload.values.title.trim();
      todo.description = action.payload.values.description.trim();
      todo.updatedAt = new Date().toISOString();
    },
    deleteTodo(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setTodoStatus(state, action: PayloadAction<{ id: string; status: TodoStatus }>) {
      const todo = state.items.find((item) => item.id === action.payload.id);
      if (!todo) return;

      todo.status = action.payload.status;
      todo.updatedAt = new Date().toISOString();
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    clearCompleted(state) {
      state.items = state.items.filter((item) => item.status !== 'completed');
    },
  },
});

export const {
  addTodo,
  clearCompleted,
  deleteTodo,
  hydrateTodos,
  setSearch,
  setTodoStatus,
  updateTodo,
} = todosSlice.actions;
export const todosReducer = todosSlice.reducer;
