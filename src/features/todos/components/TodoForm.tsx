import { zodResolver } from '@hookform/resolvers/zod';
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useId, useRef, useState, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TODO_TYPES, type TodoFormValues, type TodoType } from '@/features/todos/todo.types';

interface StatusSelectProps {
  id: string;
  name: string;
  value: TodoType;
  onChange: (value: TodoType) => void;
  onBlur: () => void;
  inputRef: Ref<HTMLInputElement>;
  invalid: boolean;
  describedBy?: string;
}

function StatusSelect({
  id,
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  invalid,
  describedBy,
}: StatusSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedLabel = t(`todo.types.${value}`);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <input ref={inputRef} type="hidden" name={name} value={value} readOnly />
      <button
        id={id}
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-left text-sm text-foreground shadow-sm outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onBlur={onBlur}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span>{selectedLabel}</span>
        <CaretDownIcon
          aria-hidden="true"
          className={`size-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={t('todo.typeLabel')}
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card p-1 text-foreground shadow-lg"
        >
          {TODO_TYPES.map((type) => {
            const selected = type === value;
            return (
              <button
                key={type}
                type="button"
                role="option"
                aria-selected={selected}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted"
                onClick={() => {
                  onChange(type);
                  setOpen(false);
                }}
              >
                <span>{t(`todo.types.${type}`)}</span>
                {selected && <CheckIcon aria-hidden="true" className="size-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
    control,
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
      <div className="flex flex-col gap-2">
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

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="todo-type">
          {t('todo.typeLabel')}
        </label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <StatusSelect
              id="todo-type"
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={field.ref}
              invalid={Boolean(errors.type)}
              describedBy={errors.type ? 'todo-type-error' : undefined}
            />
          )}
        />
        {errors.type && (
          <p id="todo-type-error" className="text-sm font-medium text-destructive">
            {errors.type.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
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
