import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';

import {
  TODO_STATUSES,
  type Todo,
  type TodoFormValues,
  type TodoStatus,
} from '@/features/todos/todo.types';

import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  todos: Todo[];
  onMove: (id: string, status: TodoStatus) => void;
  onUpdate: (id: string, values: TodoFormValues) => void;
  onDelete: (id: string) => void;
}

export function KanbanBoard({ todos, onMove, onUpdate, onDelete }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  const activeTodo = todos.find((todo) => todo.id === activeId);

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const status = event.over?.id as TodoStatus | undefined;
    if (status && TODO_STATUSES.includes(status) && event.active.data.current?.status !== status) {
      onMove(String(event.active.id), status);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <div className="grid auto-cols-[minmax(280px,85vw)] grid-flow-col gap-4 overflow-x-auto pb-3 lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible">
        {TODO_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            todos={todos.filter((todo) => todo.status === status)}
            onMove={onMove}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTodo ? (
          <div className="w-72 rounded-xl border border-primary bg-card p-4 shadow-xl">
            <p className="font-semibold">{activeTodo.title}</p>
            {activeTodo.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {activeTodo.description}
              </p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
