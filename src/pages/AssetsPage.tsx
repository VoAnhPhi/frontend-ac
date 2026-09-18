import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button';
import { CopyAddressButton } from '../components/ui/CopyAddressButton';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { formatAddress, nfts, tokens, type AssetItem } from '../features/profile/data';

function Progress({ value }: { value: number }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-progress"
      aria-label={`${value}% minted`}
    >
      <div className="h-full rounded-full bg-brand-dark" style={{ width: `${value}%` }} />
    </div>
  );
}

export function AssetsPage({ type }: { type: 'token' | 'nft' }) {
  const isToken = type === 'token';
  const items = isToken ? tokens : nfts;
  const [selected, setSelected] = useState<AssetItem | null>(null);
  const [mintReady, setMintReady] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ amount: string }>({ defaultValues: { amount: '10' } });

  useEffect(() => {
    reset({ amount: '10' });
    setMintReady(false);
  }, [selected, reset]);

  const addressLine = (item: AssetItem) => (
    <div className="flex min-w-0 items-center text-xs">
      <span className="truncate" title={item.address}>
        {formatAddress(item.address)}
      </span>
      <CopyAddressButton address={item.address} label={item.name} />
    </div>
  );

  return (
    <div className="w-full p-3 sm:p-4">
      {!items.length ? (
        <div className="rounded-lg bg-white p-8 text-center text-sm text-muted">
          No {isToken ? 'tokens' : 'NFTs'} found.
        </div>
      ) : (
        <>
          <div className="space-y-2 md:hidden">
            {items.map((item) => (
              <article key={item.id} className="rounded-lg bg-white p-2.5 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <img
                    src={item.image}
                    alt=""
                    className="size-9 rounded-full object-cover sm:size-11"
                  />
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-medium sm:text-base">
                      {item.name}{' '}
                      {item.symbol && (
                        <span className="text-xs text-muted sm:text-sm">{item.symbol}</span>
                      )}
                    </h2>
                    {addressLine(item)}
                  </div>
                </div>
                <div
                  className={`mt-3 grid gap-3 text-xs sm:mt-4 sm:gap-4 sm:text-sm ${isToken ? 'grid-cols-2' : 'grid-cols-1'}`}
                >
                  {isToken && (
                    <div>
                      <p className="text-xs text-muted">Balance</p>
                      <p className="mt-0.5 sm:mt-1">{item.balance}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted">% of Supply</p>
                    <p className="mt-0.5 sm:mt-1">{item.supplyPercent}%</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 sm:mt-4 sm:gap-4">
                  <Progress value={item.mintProgress} />
                  <Button variant="secondary" size="sm" onClick={() => setSelected(item)}>
                    Mint
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-lg md:block">
            <div
              className={`grid items-center gap-5 bg-white px-4 py-4 text-sm text-muted ${isToken ? 'grid-cols-[minmax(280px,1.5fr)_100px_120px_180px_90px]' : 'grid-cols-[minmax(280px,1.5fr)_120px_180px_90px]'}`}
            >
              <span className="text-ink">{isToken ? 'Tokens' : 'NFT'}</span>
              {isToken && <span className="text-center">Balance</span>}
              <span className="text-center">% of Supply</span>
              <span className="text-center">Mint Progress</span>
              <span className="text-right">Action</span>
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className={`mt-1 grid items-center gap-5 bg-white px-4 py-3 ${isToken ? 'grid-cols-[minmax(280px,1.5fr)_100px_120px_180px_90px]' : 'grid-cols-[minmax(280px,1.5fr)_120px_180px_90px]'}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={item.image}
                    alt=""
                    className="size-11 shrink-0 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {item.name}{' '}
                      {item.symbol && <span className="text-sm text-muted">{item.symbol}</span>}
                    </p>
                    {addressLine(item)}
                  </div>
                </div>
                {isToken && <span className="text-center font-medium">{item.balance}</span>}
                <span className="text-center font-medium">{item.supplyPercent}%</span>
                <Progress value={item.mintProgress} />
                <Button variant="secondary" size="sm" onClick={() => setSelected(item)}>
                  Mint
                </Button>
              </div>
            ))}
          </div>
        </>
      )}

      {selected && (
        <Dialog
          title={`${selected.name}${isToken ? ' Token' : ''}`}
          onClose={() => setSelected(null)}
        >
          <form noValidate className="space-y-5" onSubmit={handleSubmit(() => setMintReady(true))}>
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
            <Button type="submit" size="lg" className="w-full">
              Mint
            </Button>
            {mintReady && (
              <p role="status" className="text-center text-sm text-brand-dark">
                Mint request is ready. Wallet integration is not connected yet.
              </p>
            )}
          </form>
        </Dialog>
      )}
    </div>
  );
}
