import { useDraggable } from '@dnd-kit/core';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  TODO_STATUSES,
  type Todo,
  type TodoFormValues,
  type TodoStatus,
} from '@/features/todos/todo.types';

import { TodoForm } from './TodoForm';

interface TodoItemProps {
  todo: Todo;
  onMove: (id: string, status: TodoStatus) => void;
  onUpdate: (id: string, values: TodoFormValues) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onMove, onUpdate, onDelete }: TodoItemProps) {
  const { t, i18n } = useTranslation();
  const [editing, setEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id,
    data: { status: todo.status },
  });

  const style: CSSProperties | undefined = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  const statusIndex = TODO_STATUSES.indexOf(todo.status);

  const handleUpdate = (values: TodoFormValues) => {
    onUpdate(todo.id, values);
    setEditing(false);
    toast.success(t('toast.updated'));
  };

  const handleDelete = () => {
    onDelete(todo.id);
    toast.success(t('toast.deleted'));
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
            <h3
              className={
                todo.status === 'completed'
                  ? 'break-words font-semibold text-muted-foreground line-through'
                  : 'break-words font-semibold'
              }
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">
                {todo.description}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">{t('todo.created', { date })}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8"
              disabled={statusIndex === 0}
              onClick={() => onMove(todo.id, TODO_STATUSES[statusIndex - 1])}
              aria-label={t('actions.moveLeft')}
              title={t('actions.moveLeft')}
            >
              <ArrowLeftIcon size={16} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8"
              disabled={statusIndex === TODO_STATUSES.length - 1}
              onClick={() => onMove(todo.id, TODO_STATUSES[statusIndex + 1])}
              aria-label={t('actions.moveRight')}
              title={t('actions.moveRight')}
            >
              <ArrowRightIcon size={16} />
            </Button>
          </div>
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
          </div>
        </div>
      </article>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('todo.editTitle')}</DialogTitle>
            <DialogDescription>{t('todo.editDescription')}</DialogDescription>
          </DialogHeader>
          <TodoForm
            defaultValues={{ title: todo.title, description: todo.description }}
            submitLabel={t('actions.save')}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
