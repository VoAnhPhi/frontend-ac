import { useForm } from 'react-hook-form';
import { getErrorMessage } from '../../app/api';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Loading } from '../../components/ui/Loading';
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
    try {
      await updateAsset({
        id: token.id,
        name,
        supply: Number(values.supply),
        description: values.description.trim(),
      }).unwrap();
      onSaved(name);
    } catch {
      /* The error is rendered from the mutation state. */
    }
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
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}
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

export function EditTokenDialog({
  tokenId,
  onClose,
  onSaved,
}: {
  tokenId: number;
  onClose: () => void;
  onSaved: (name: string) => void;
}) {
  const { data: token, error, isFetching, refetch } = useGetAssetQuery(tokenId);
  return (
    <Dialog title="Edit Token" onClose={onClose}>
      {token ? (
        <EditTokenForm token={token} onClose={onClose} onSaved={onSaved} />
      ) : error && !isFetching ? (
        <div className="space-y-4 text-center">
          <p role="alert" className="text-sm text-red-600">
            {getErrorMessage(error)}
          </p>
          <Button type="button" variant="secondary" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <div className="grid place-items-center py-10">
          <Loading label="Loading token" />
        </div>
      )}
    </Dialog>
  );
}
