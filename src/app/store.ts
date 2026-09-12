import { configureStore } from '@reduxjs/toolkit';

import { todosReducer } from '@/features/todos/todoSlice';
import { loadTodos, saveTodos } from '@/features/todos/todoStorage';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  preloadedState: {
    todos: {
      items: loadTodos(),
      search: '',
    },
  },
});

store.subscribe(() => saveTodos(store.getState().todos.items));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
