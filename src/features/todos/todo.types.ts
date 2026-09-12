export const TODO_STATUSES = ['todo', 'in-progress', 'completed'] as const;
export type TodoStatus = (typeof TODO_STATUSES)[number];

export const TODO_TYPES = TODO_STATUSES;
export type TodoType = TodoStatus;

export interface Todo {
  id: string;
  title: string;
  description: string;
  type: TodoType;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFormValues {
  title: string;
  description: string;
  type: TodoType;
}
