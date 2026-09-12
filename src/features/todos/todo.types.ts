export const TODO_STATUSES = ['todo', 'in-progress', 'completed'] as const;
export type TodoStatus = (typeof TODO_STATUSES)[number];

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFormValues {
  title: string;
  description: string;
}
