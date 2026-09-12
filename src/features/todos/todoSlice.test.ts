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
      addTodo({
        title: 'Learn Redux',
        description: 'Read the toolkit guide',
        type: 'incomplete',
      }),
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({
      title: 'Learn Redux',
      type: 'incomplete',
      status: 'todo',
    });

    const id = state.items[0].id;
    state = todosReducer(
      state,
      updateTodo({
        id,
        values: { title: 'Practice Redux', description: 'Build a slice', type: 'completed' },
      }),
    );
    expect(state.items[0]).toMatchObject({
      title: 'Practice Redux',
      type: 'completed',
      status: 'completed',
    });

    state = todosReducer(state, setTodoStatus({ id, status: 'completed' }));
    expect(state.items[0]).toMatchObject({ status: 'completed', type: 'completed' });

    state = todosReducer(state, setTodoStatus({ id, status: 'todo' }));
    expect(state.items[0]).toMatchObject({ status: 'todo', type: 'incomplete' });

    state = todosReducer(state, deleteTodo(id));
    expect(state.items).toHaveLength(0);
  });

  it('clears only completed todos', () => {
    let state = todosReducer(
      initialState,
      addTodo({ title: 'First', description: '', type: 'incomplete' }),
    );
    state = todosReducer(state, addTodo({ title: 'Second', description: '', type: 'incomplete' }));
    state = todosReducer(state, setTodoStatus({ id: state.items[0].id, status: 'completed' }));
    state = todosReducer(state, clearCompleted());

    expect(state.items).toHaveLength(1);
    expect(state.items[0].status).toBe('todo');
  });
});
