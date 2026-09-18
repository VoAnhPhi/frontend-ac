import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { updateProfile, type Profile } from './profileSlice';

export function EditProfileDialog({ onClose }: { onClose: () => void }) {
  const profile = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Profile>({ defaultValues: profile });

  function save(values: Profile) {
    dispatch(
      updateProfile({ ...values, name: values.name.trim(), biography: values.biography.trim() }),
    );
    onClose();
  }

  return (
    <Dialog title="Edit Profile" onClose={onClose}>
      <form noValidate onSubmit={handleSubmit(save)} className="space-y-4">
        <Input
          label="Name"
          autoFocus
          requiredMark
          maxLength={32}
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            maxLength: { value: 32, message: 'Maximum 32 characters' },
            validate: (value) => value.trim().length > 0 || 'Name is required',
          })}
        />
        <Textarea label="Biography" rows={3} maxLength={500} {...register('biography')} />
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
        <Input label="Telegram" type="url" placeholder="https://t.me/…" {...register('telegram')} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Dialog>
  );
}
