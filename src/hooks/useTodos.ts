import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  addTodo,
  clearCompleted,
  deleteTodo,
  setSearch,
  setTodoStatus,
  updateTodo,
} from '@/features/todos/todoSlice';

export function useTodos() {
  const dispatch = useAppDispatch();
  const { items, search } = useAppSelector((state) => state.todos);

  const visibleTodos = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return items.filter((todo) => {
      const matchesSearch =
        !query ||
        todo.title.toLocaleLowerCase().includes(query) ||
        todo.description.toLocaleLowerCase().includes(query);
      return matchesSearch;
    });
  }, [items, search]);

  const completedCount = items.filter((todo) => todo.status === 'completed').length;

  return {
    items,
    visibleTodos,
    search,
    completedCount,
    addTodo: (values: Parameters<typeof addTodo>[0]) => dispatch(addTodo(values)),
    updateTodo: (payload: Parameters<typeof updateTodo>[0]) => dispatch(updateTodo(payload)),
    deleteTodo: (id: string) => dispatch(deleteTodo(id)),
    setTodoStatus: (payload: Parameters<typeof setTodoStatus>[0]) =>
      dispatch(setTodoStatus(payload)),
    setSearch: (value: string) => dispatch(setSearch(value)),
    clearCompleted: () => dispatch(clearCompleted()),
  };
}
