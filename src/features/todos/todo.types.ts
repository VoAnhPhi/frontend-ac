export const TODO_STATUSES = ['todo', 'in-progress', 'completed'] as const;
export type TodoStatus = (typeof TODO_STATUSES)[number];

export const TODO_TYPES = ['task', 'bug', 'feature', 'improvement'] as const;
export type TodoType = (typeof TODO_TYPES)[number];

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
