import { useDroppable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import type { Todo, TodoFormValues, TodoStatus } from '@/features/todos/todo.types';
import { cn } from '@/lib/utils';

import { TodoItem } from './TodoItem';

interface KanbanColumnProps {
  status: TodoStatus;
  todos: Todo[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onUpdate: (id: string, values: TodoFormValues) => void;
  onDelete: (id: string) => void;
}

export function KanbanColumn({
  status,
  todos,
  onToggleComplete,
  onUpdate,
  onDelete,
}: KanbanColumnProps) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={cn(
        'flex min-h-96 flex-col rounded-xl border border-border bg-muted/45 p-3 transition-colors',
        isOver && 'border-primary bg-primary/10',
      )}
      aria-label={t(`todo.columns.${status}`)}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="font-semibold">{t(`todo.columns.${status}`)}</h2>
        <Badge variant="secondary">{todos.length}</Badge>
      </div>
      <div className="grid content-start gap-3">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={onToggleComplete}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
        {todos.length === 0 && (
          <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-border px-4 text-center text-sm text-muted-foreground">
            {t('todo.dropHere')}
          </div>
        )}
      </div>
    </section>
  );
}
