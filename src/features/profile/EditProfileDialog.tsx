import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { updateProfile, type Profile } from './profileSlice';

export function EditProfileDialog({ onClose }: { onClose: () => void }) {
  const profile = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<Profile>({ defaultValues: profile });

  useEffect(() => {
    setFocus('name');
  }, [setFocus]);
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function save(values: Profile) {
    dispatch(
      updateProfile({ ...values, name: values.name.trim(), biography: values.biography.trim() }),
    );
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-[500px] overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="edit-profile-title" className="text-2xl font-bold">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            className="rounded-full px-2 py-1 text-xl hover:bg-surface"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit(save)} className="space-y-4">
          <Input
            label="Name"
            maxLength={32}
            error={errors.name?.message}
            {...register('name', {
              required: 'Name is required',
              maxLength: { value: 32, message: 'Maximum 32 characters' },
              validate: (value) => value.trim().length > 0 || 'Name is required',
            })}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="biography" className="text-sm font-medium">
              Biography
            </label>
            <textarea
              id="biography"
              rows={3}
              maxLength={500}
              {...register('biography')}
              className="w-full rounded-lg border border-[#ebecec] bg-[#f5fbfb] p-3 outline-none focus:border-brand"
            />
          </div>
          <Input
            label="Twitter / X"
            type="url"
            placeholder="https://x.com/…"
            {...register('twitter')}
          />
          <Input
            label="GitHub"
            type="url"
            placeholder="https://github.com/…"
            {...register('github')}
          />
          <Input
            label="Telegram"
            type="url"
            placeholder="https://t.me/…"
            {...register('telegram')}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
