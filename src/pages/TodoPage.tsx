import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { KanbanBoard } from '@/features/todos/components/KanbanBoard';
import { TodoForm } from '@/features/todos/components/TodoForm';
import type { TodoFormValues } from '@/features/todos/todo.types';
import { useTodos } from '@/hooks/useTodos';

export function TodoPage() {
  const { t } = useTranslation();
  const [adding, setAdding] = useState(false);
  const todos = useTodos();

  const handleAdd = (values: TodoFormValues) => {
    todos.addTodo(values);
    setAdding(false);
    toast.success(t('toast.added'));
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('todo.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('todo.description')}</p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <PlusIcon size={18} weight="bold" />
          {t('actions.add')}
        </Button>
      </div>

      <div className="mb-5 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:w-72">
          <MagnifyingGlassIcon
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            className="pl-10"
            type="search"
            value={todos.search}
            onChange={(event) => todos.setSearch(event.target.value)}
            placeholder={t('todo.searchPlaceholder')}
          />
        </div>
      </div>

      <KanbanBoard
        todos={todos.visibleTodos}
        onMove={(id, status) => todos.setTodoStatus({ id, status })}
        onUpdate={(id, values) => todos.updateTodo({ id, values })}
        onDelete={todos.deleteTodo}
      />

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('todo.newTitle')}</DialogTitle>
            <DialogDescription>{t('todo.description')}</DialogDescription>
          </DialogHeader>
          <TodoForm
            submitLabel={t('actions.add')}
            onSubmit={handleAdd}
            onCancel={() => setAdding(false)}
            resetAfterSubmit
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
