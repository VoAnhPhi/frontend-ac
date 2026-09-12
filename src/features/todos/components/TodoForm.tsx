import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TODO_TYPES, type TodoFormValues } from '@/features/todos/todo.types';

interface TodoFormProps {
  defaultValues?: TodoFormValues;
  submitLabel: string;
  onSubmit: (values: TodoFormValues) => void;
  onCancel?: () => void;
  resetAfterSubmit?: boolean;
}

export function TodoForm({
  defaultValues = { title: '', description: '', type: 'todo' },
  submitLabel,
  onSubmit,
  onCancel,
  resetAfterSubmit = false,
}: TodoFormProps) {
  const { t } = useTranslation();
  const schema = z.object({
    title: z
      .string()
      .trim()
      .min(1, t('validation.titleRequired'))
      .max(100, t('validation.titleMax')),
    description: z.string().trim().max(300, t('validation.descriptionMax')),
    type: z.enum(TODO_TYPES),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const submit = (values: TodoFormValues) => {
    onSubmit(values);
    if (resetAfterSubmit) reset({ title: '', description: '', type: 'todo' });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)} noValidate>
      <div className="space-y-3">
        <label className="text-sm font-medium" htmlFor="todo-title">
          {t('todo.titleLabel')}
        </label>
        <Input
          id="todo-title"
          placeholder={t('todo.titlePlaceholder')}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'todo-title-error' : undefined}
          {...register('title')}
        />
        {errors.title && (
          <p id="todo-title-error" className="text-sm font-medium text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium" htmlFor="todo-type">
          {t('todo.typeLabel')}
        </label>
        <select
          id="todo-type"
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-invalid={Boolean(errors.type)}
          aria-describedby={errors.type ? 'todo-type-error' : undefined}
          {...register('type')}
        >
          {TODO_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`todo.types.${type}`)}
            </option>
          ))}
        </select>
        {errors.type && (
          <p id="todo-type-error" className="text-sm font-medium text-destructive">
            {errors.type.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium" htmlFor="todo-description">
          {t('todo.descriptionLabel')}
        </label>
        <Textarea
          id="todo-description"
          placeholder={t('todo.descriptionPlaceholder')}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'todo-description-error' : undefined}
          {...register('description')}
        />
        {errors.description && (
          <p id="todo-description-error" className="text-sm font-medium text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
