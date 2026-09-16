import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { Icon } from '../components/ui/Icon';
import { Input } from '../components/ui/Input';
import { nfts, tokens, type AssetItem } from '../features/profile/data';

function Progress({ value }: { value: number }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-[#edf5f4]"
      aria-label={`${value}% minted`}
    >
      <div className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
    </div>
  );
}

export function AssetsPage({ type }: { type: 'token' | 'nft' }) {
  const isToken = type === 'token';
  const items = isToken ? tokens : nfts;
  const [selected, setSelected] = useState<AssetItem | null>(null);

  function progressFor(index: number) {
    return isToken ? [100, 0, 0, 100][index] : 100;
  }

  return (
    <div className="w-full p-4">
      <div className="space-y-3 md:hidden">
        {items.map((item, index) => (
          <article key={item.id} className="rounded-lg bg-white p-4">
            <div className="flex items-center gap-3">
              <img src={item.image} alt="" className="size-11 rounded-full object-cover" />
              <div className="min-w-0">
                <h2 className="truncate font-medium">
                  {item.name}{' '}
                  {item.symbol && <span className="text-sm text-muted">{item.symbol}</span>}
                </h2>
                <p className="flex items-center gap-1 truncate text-xs">
                  {item.address} <Icon name="copy" />
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              {isToken && (
                <div>
                  <p className="text-xs text-muted">Balance</p>
                  <p className="mt-1">{item.balance}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted">% of Supply</p>
                <p className="mt-1">{item.supplyPercent}%</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Progress value={progressFor(index)} />
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
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`mt-1 grid items-center gap-5 bg-white px-4 py-3 ${isToken ? 'grid-cols-[minmax(280px,1.5fr)_100px_120px_180px_90px]' : 'grid-cols-[minmax(280px,1.5fr)_120px_180px_90px]'}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <img src={item.image} alt="" className="size-11 shrink-0 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {item.name}{' '}
                  {item.symbol && <span className="text-sm text-muted">{item.symbol}</span>}
                </p>
                <p className="flex items-center gap-1 truncate text-xs">
                  {item.address}
                  <Icon name="copy" />
                </p>
              </div>
            </div>
            {isToken && <span className="text-center font-medium">{item.balance}</span>}
            <span className="text-center font-medium">{item.supplyPercent}%</span>
            <Progress value={progressFor(index)} />
            <Button variant="secondary" size="sm" onClick={() => setSelected(item)}>
              Mint
            </Button>
          </div>
        ))}
      </div>

      {selected && (
        <Dialog
          title={`${selected.name}${isToken ? ' Token' : ''}`}
          onClose={() => setSelected(null)}
        >
          <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
            <Input label="Amount Per Mint" defaultValue="10" />
            <div className="relative">
              <Input label="Mint Fee" defaultValue="0.012" readOnly />
              <span className="absolute bottom-4 right-3 text-xs text-muted">ZKN</span>
            </div>
            <Button type="submit" size="lg" className="w-full">
              Mint
            </Button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
