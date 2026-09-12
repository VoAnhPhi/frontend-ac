import { describe, expect, it } from 'vitest';

import {
  addTodo,
  clearCompleted,
  deleteTodo,
  initialState,
  setTodoStatus,
  todosReducer,
  updateTodo,
} from './todoSlice';

describe('todos reducer', () => {
  it('adds, edits, toggles, and deletes a todo', () => {
    let state = todosReducer(
      initialState,
      addTodo({ title: 'Learn Redux', description: 'Read the toolkit guide', type: 'task' }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ title: 'Learn Redux', type: 'task', status: 'todo' });

    const id = state.items[0].id;
    state = todosReducer(
      state,
      updateTodo({
        id,
        values: { title: 'Practice Redux', description: 'Build a slice', type: 'feature' },
      }),
    );
    expect(state.items[0]).toMatchObject({ title: 'Practice Redux', type: 'feature' });

    state = todosReducer(state, setTodoStatus({ id, status: 'completed' }));
    expect(state.items[0].status).toBe('completed');

    state = todosReducer(state, deleteTodo(id));
    expect(state.items).toHaveLength(0);
  });

  it('clears only completed todos', () => {
    let state = todosReducer(
      initialState,
      addTodo({ title: 'First', description: '', type: 'task' }),
    );
    state = todosReducer(state, addTodo({ title: 'Second', description: '', type: 'task' }));
    state = todosReducer(state, setTodoStatus({ id: state.items[0].id, status: 'completed' }));
    state = todosReducer(state, clearCompleted());

    expect(state.items).toHaveLength(1);
    expect(state.items[0].status).toBe('todo');
  });
});
