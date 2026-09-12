import type { Todo, TodoStatus } from './todo.types';

const STORAGE_KEY = 'taskflow.todos.v1';

function normalizeTodo(value: unknown): Todo | null {
  if (!value || typeof value !== 'object') return null;

  const todo = value as Record<string, unknown>;
  const hasValidFields =
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    typeof todo.description === 'string' &&
    typeof todo.createdAt === 'string' &&
    typeof todo.updatedAt === 'string';

  if (!hasValidFields) return null;

  const status: TodoStatus | null =
    todo.status === 'pending'
      ? 'todo'
      : todo.status === 'todo' || todo.status === 'in-progress' || todo.status === 'completed'
        ? todo.status
        : null;

  if (!status) return null;

  return {
    id: todo.id as string,
    title: todo.title as string,
    description: todo.description as string,
    status,
    createdAt: todo.createdAt as string,
    updatedAt: todo.updatedAt as string,
  };
}

export function loadTodos(): Todo[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeTodo).filter((todo): todo is Todo => todo !== null);
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // The app remains usable in memory when storage is unavailable.
  }
}
