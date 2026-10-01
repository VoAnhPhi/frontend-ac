import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Input } from '../../components/ui/Input';
import { QueryState } from '../../components/ui/QueryState';
import { Skeleton } from '../../components/ui/Skeleton';
import { Textarea } from '../../components/ui/Textarea';
import { useGetAssetQuery, useUpdateAssetMutation, type AssetDetails } from './assetsApi';

type FormValues = { name: string; supply: string; description: string };

function EditTokenForm({
  token,
  onClose,
  onSaved,
}: {
  token: AssetDetails;
  onClose: () => void;
  onSaved: (name: string) => void;
}) {
  const [updateAsset, { isLoading, error }] = useUpdateAssetMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: token.name,
      supply: String(token.supply),
      description: token.description,
    },
  });
  const description = watch('description') ?? '';

  async function save(values: FormValues) {
    const name = values.name.trim();
    const result = await updateAsset({
      id: token.id,
      name,
      supply: Number(values.supply),
      description: values.description.trim(),
    });
    if (!result.error) onSaved(name);
  }

  return (
    <form noValidate onSubmit={handleSubmit(save)} className="space-y-4">
      <Input
        label="Name"
        autoFocus
        requiredMark
        maxLength={100}
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          maxLength: { value: 100, message: 'Maximum 100 characters' },
          validate: (value) => value.trim().length > 0 || 'Name is required',
        })}
      />
      <Input
        label="Supply"
        requiredMark
        numeric="integer"
        error={errors.supply?.message}
        {...register('supply', {
          required: 'Supply is required',
          pattern: { value: /^\d+$/, message: 'Enter digits only' },
          validate: (value) => Number(value) > 0 || 'Enter a value greater than 0',
        })}
      />
      <Textarea
        label="Description"
        rows={4}
        maxLength={500}
        counter={`${description.length}/500`}
        {...register('description')}
      />
      <ErrorMessage error={error} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          Save
        </Button>
      </div>
    </form>
  );
}

/** The form's loading placeholder: the same fields, field heights, and buttons. */
function EditTokenSkeleton() {
  return (
    <div className="space-y-4">
      {['w-12', 'w-14'].map((labelWidth) => (
        <div key={labelWidth} className="flex flex-col gap-1">
          <p className="text-xs leading-5 sm:text-sm sm:leading-6">
            <Skeleton inline className={`h-3 rounded ${labelWidth}`} />
          </p>
          <Skeleton className="h-10 w-full rounded-lg sm:h-12" />
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <p className="text-xs leading-5 sm:text-sm sm:leading-6">
          <Skeleton inline className="h-3 w-20 rounded" />
        </p>
        <Skeleton className="h-24 w-full rounded-lg sm:h-[120px]" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function EditTokenDialog({
  tokenId,
  onClose,
  onSaved,
}: {
  tokenId: number;
  onClose: () => void;
  onSaved: (name: string) => void;
}) {
  const token = useGetAssetQuery(tokenId);
  return (
    <Dialog title="Edit Token" onClose={onClose}>
      <QueryState
        query={token}
        loadingLabel="Loading token"
        skeleton={<EditTokenSkeleton />}
        className="grid place-items-center py-10 text-center"
      >
        {(details) => <EditTokenForm token={details} onClose={onClose} onSaved={onSaved} />}
      </QueryState>
    </Dialog>
  );
}
