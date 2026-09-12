import { useDraggable } from '@dnd-kit/core';
import {
  CheckCircleIcon,
  CircleIcon,
  DotsSixVerticalIcon,
  PencilSimpleIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Todo, TodoFormValues } from '@/features/todos/todo.types';

import { TodoForm } from './TodoForm';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string, completed: boolean) => void;
  onUpdate: (id: string, values: TodoFormValues) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggleComplete, onUpdate, onDelete }: TodoItemProps) {
  const { t, i18n } = useTranslation();
  const [editing, setEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id,
    data: { status: todo.status },
  });

  const style: CSSProperties | undefined = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  const handleUpdate = (values: TodoFormValues) => {
    onUpdate(todo.id, values);
    setEditing(false);
    toast.success(t('toast.updated'));
  };

  const handleDelete = () => {
    onDelete(todo.id);
    toast.success(t('toast.deleted'));
  };

  const handleToggleComplete = () => {
    onToggleComplete(todo.id, todo.type !== 'completed');
    toast.success(t(todo.type === 'completed' ? 'toast.markedIncomplete' : 'toast.markedComplete'));
  };

  const date = new Intl.DateTimeFormat(i18n.language === 'en' ? 'en-US' : 'vi-VN', {
    dateStyle: 'medium',
  }).format(new Date(todo.createdAt));

  return (
    <>
      <article
        ref={setNodeRef}
        style={style}
        className={
          isDragging
            ? 'relative z-20 rounded-xl border border-primary bg-card p-4 opacity-50 shadow-lg'
            : 'rounded-xl border border-border bg-card p-4 shadow-sm'
        }
      >
        <div className="flex items-start gap-2">
          <button
            type="button"
            className="mt-0.5 shrink-0 touch-none cursor-grab rounded-md p-1 text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
            aria-label={t('accessibility.drag', { title: todo.title })}
            {...listeners}
            {...attributes}
          >
            <DotsSixVerticalIcon size={18} weight="bold" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={
                  todo.status === 'completed'
                    ? 'break-words font-semibold text-muted-foreground line-through'
                    : 'break-words font-semibold'
                }
              >
                {todo.title}
              </h3>
              <Badge variant="secondary">{t(`todo.types.${todo.type}`)}</Badge>
            </div>
            {todo.description && (
              <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">
                {todo.description}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">{t('todo.created', { date })}</p>
          </div>
        </div>

        <div className="mt-3 flex justify-end border-t border-border pt-3">
          <div className="flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8"
              title={t('actions.edit')}
              aria-label={t('actions.edit')}
              onClick={() => setEditing(true)}
            >
              <PencilSimpleIcon size={17} />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  title={t('actions.delete')}
                  aria-label={t('actions.delete')}
                >
                  <TrashIcon size={17} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('todo.deleteTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>{t('todo.deleteDescription')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    {t('actions.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8"
              title={t(
                todo.type === 'completed' ? 'actions.markIncomplete' : 'actions.markComplete',
              )}
              aria-label={t(
                todo.type === 'completed' ? 'actions.markIncomplete' : 'actions.markComplete',
              )}
              onClick={handleToggleComplete}
            >
              {todo.type === 'completed' ? (
                <CheckCircleIcon size={18} weight="fill" />
              ) : (
                <CircleIcon size={18} />
              )}
            </Button>
          </div>
        </div>
      </article>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{t('todo.editTitle')}</DialogTitle>
            <DialogDescription>{t('todo.editDescription')}</DialogDescription>
          </DialogHeader>
          <TodoForm
            defaultValues={{ title: todo.title, description: todo.description, type: todo.type }}
            submitLabel={t('actions.save')}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
