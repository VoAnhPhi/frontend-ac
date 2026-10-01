import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../app/api';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { useGetMeQuery } from '../auth/authApi';
import type { AssetItem } from './assetsApi';
import { useMintMutation } from './holdingsApi';

export function MintDialog({ asset, onClose }: { asset: AssetItem; onClose: () => void }) {
  const { data: user } = useGetMeQuery();
  const [mint, { isLoading, isSuccess, error, originalArgs }] = useMintMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ amount: string }>({ defaultValues: { amount: '10' } });

  async function submit({ amount }: { amount: string }) {
    if (!user) return;
    try {
      await mint({ userId: user.id, asset, quantity: Number(amount) }).unwrap();
    } catch {
      /* The error is rendered from the mutation state. */
    }
  }

  return (
    <Dialog title={`${asset.name}${asset.type === 'token' ? ' Token' : ''}`} onClose={onClose}>
      <form noValidate className="space-y-5" onSubmit={handleSubmit(submit)}>
        <Input
          label="Amount per mint"
          requiredMark
          numeric="integer"
          error={errors.amount?.message}
          {...register('amount', {
            required: 'Amount is required',
            pattern: { value: /^\d+$/, message: 'Enter digits only' },
            validate: (value) => Number(value) > 0 || 'Enter a value greater than 0',
          })}
        />
        <div className="relative">
          <Input label="Mint Fee" defaultValue="0.012" readOnly />
          <span className="absolute bottom-4 right-3 text-xs text-muted">ZKN</span>
        </div>
        <Button type="submit" size="lg" loading={isLoading} disabled={!user} className="w-full">
          Mint
        </Button>
        {error && (
          <p role="alert" className="text-center text-sm text-red-600">
            {getErrorMessage(error)}
          </p>
        )}
        {isSuccess && originalArgs && (
          <p role="status" className="text-center text-sm text-brand-dark">
            Minted {originalArgs.quantity} {asset.name}.{' '}
            <Link
              to={`/profile/${asset.type === 'nft' ? 'nfts' : 'tokens'}`}
              className="font-medium underline"
            >
              View in Profile
            </Link>
          </p>
        )}
      </form>
    </Dialog>
  );
}
