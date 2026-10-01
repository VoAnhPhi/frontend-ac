import type { ReactNode } from 'react';
import type { AssetItem, AssetType } from '../../features/assets/assetsApi';

const priceFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

// Each row is its own grid, so every column except the first needs a fixed width to line up.
const columns = {
  token:
    'grid-cols-[minmax(180px,1fr)_80px_100px_minmax(120px,180px)_164px] xl:grid-cols-[minmax(280px,1fr)_100px_120px_180px_164px]',
  nft: 'grid-cols-[minmax(180px,1fr)_100px_minmax(120px,180px)_90px] xl:grid-cols-[minmax(280px,1fr)_120px_180px_90px]',
};

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

export function AssetSubtitle({ item }: { item: AssetItem }) {
  if (item.price === undefined) return null;
  return <p className="text-xs leading-7 text-muted">{priceFormat.format(item.price)}</p>;
}

export function AssetList({
  type,
  items,
  renderActions,
}: {
  type: AssetType;
  items: AssetItem[];
  renderActions: (item: AssetItem) => ReactNode;
}) {
  const isToken = type === 'token';

  if (!items.length) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-sm text-muted">
        No {isToken ? 'tokens' : 'NFTs'} found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 md:hidden">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg bg-white p-2.5 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={item.image}
                alt=""
                className="size-9 shrink-0 rounded-full object-cover sm:size-11"
              />
              <div className="flex min-h-12 min-w-0 flex-col justify-center sm:min-h-[52px]">
                <h2 className="truncate text-sm font-medium sm:text-base">{item.name}</h2>
                <AssetSubtitle item={item} />
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
              <div className="flex shrink-0 items-center gap-1">{renderActions(item)}</div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg md:block">
        <div
          className={`grid items-center gap-4 bg-white px-4 py-4 text-sm text-muted xl:gap-5 ${columns[type]}`}
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
            className={`mt-1 grid items-center gap-4 bg-white px-4 py-3 xl:gap-5 ${columns[type]}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <img src={item.image} alt="" className="size-11 shrink-0 rounded-full object-cover" />
              <div className="flex min-h-[52px] min-w-0 flex-col justify-center">
                <p className="truncate font-medium" title={item.name}>
                  {item.name}
                </p>
                <AssetSubtitle item={item} />
              </div>
            </div>
            {isToken && <span className="text-center font-medium">{item.balance}</span>}
            <span className="text-center font-medium">{item.supplyPercent}%</span>
            <Progress value={item.mintProgress} />
            <div className="flex items-center justify-end gap-1">{renderActions(item)}</div>
          </div>
        ))}
      </div>
    </>
  );
}
