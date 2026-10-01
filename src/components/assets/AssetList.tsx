import type { ReactNode } from 'react';
import type { AssetItem, AssetType } from '../../features/assets/assetsApi';
import { CopyButton } from '../ui/CopyButton';
import { Skeleton } from '../ui/Skeleton';

const headers = {
  token: ['Tokens', 'Balance', '% of Supply', 'Mint Progress', 'Action'],
  nft: ['NFT', '% of Supply', 'Mint Progress', 'Action'],
};

// From xl up these are the design's widths and 48px gaps. Below xl they shrink so the table still
// fits beside the menu. The token action column also holds Edit and Delete, which the design
// does not have, so it is wider than the design's 76px.
const columns = {
  token:
    'grid-cols-[minmax(0,1fr)_80px_80px_120px_148px] gap-x-6 xl:grid-cols-[minmax(0,1fr)_100px_100px_164px_148px] xl:gap-x-12',
  nft: 'grid-cols-[minmax(0,1fr)_80px_120px_76px] gap-x-6 xl:grid-cols-[minmax(0,1fr)_100px_164px_76px] xl:gap-x-12',
};

// The token rows form one card; the NFT rows are separate bars 8px apart, as in each design.
const rowLayout = {
  token: { group: '', row: 'first:rounded-t-lg last:rounded-b-lg' },
  nft: { group: 'space-y-2', row: '' },
};

// The design sets the table's text at 16px in Centra No2 and Satoshi. Plus Jakarta Sans draws
// about 6% larger, so 15px matches the design's x-height and word widths.
export const tableText = 'text-[15px]';

const bodyRowClass = (type: AssetType) =>
  `grid h-[76px] items-center border-b border-surface bg-white px-4 leading-6 text-black ${tableText} ${columns[type]} ${rowLayout[type].row}`;

type Actions = (item: AssetItem) => ReactNode;

function TableHeader({ type }: { type: AssetType }) {
  const [nameHeader, ...valueHeaders] = headers[type];
  return (
    <div
      role="row"
      className={`grid h-14 items-center rounded-lg border-b border-surface bg-white px-4 leading-5 font-medium text-muted ${tableText} ${columns[type]}`}
    >
      <span role="columnheader" className="text-ink">
        {nameHeader}
      </span>
      {valueHeaders.map((header) => (
        // Below xl a label can be wider than its column; it stays on one line, centered
        // over the column, and spills into the gaps on both sides.
        <span key={header} role="columnheader" className="justify-self-center whitespace-nowrap">
          {header}
        </span>
      ))}
    </div>
  );
}

function MintProgress({ value }: { value: number }) {
  return (
    <div
      role="progressbar"
      aria-label="Mint progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="h-[9px] w-full overflow-hidden rounded-full bg-field"
    >
      <div className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
    </div>
  );
}

export function AssetIdentity({ item }: { item: AssetItem }) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      {/* Product photos have transparent backgrounds; the fill makes them round avatars. */}
      <img
        src={item.image}
        alt=""
        className="size-11 shrink-0 rounded-full bg-surface object-cover"
      />
      <div className="min-w-0">
        <p className={`truncate leading-6 font-medium text-black ${tableText}`} title={item.name}>
          {item.name}
        </p>
        {item.sku && (
          <div className="flex min-w-0 items-center gap-2 text-xs leading-4 tracking-[0.1px] text-black">
            <span className="truncate">{item.sku}</span>
            <CopyButton compact value={item.sku} label={`Copy SKU of ${item.name}`} />
          </div>
        )}
      </div>
    </div>
  );
}

function AssetCards({
  type,
  items,
  renderActions,
}: {
  type: AssetType;
  items: AssetItem[];
  renderActions: Actions;
}) {
  return (
    <div className="space-y-2 md:hidden">
      {items.map((item) => (
        <article key={item.id} className="rounded-lg bg-white p-4">
          <AssetIdentity item={item} />
          <dl className={`mt-4 grid gap-4 ${type === 'token' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {type === 'token' && (
              <div>
                <dt className="text-xs text-muted">Balance</dt>
                <dd className="mt-1 text-sm font-medium text-black">{item.balance}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-muted">% of Supply</dt>
              <dd className="mt-1 text-sm font-medium text-black">{item.supplyPercent}%</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center gap-4">
            <MintProgress value={item.mintProgress} />
            <div className="flex shrink-0 items-center gap-1">{renderActions(item)}</div>
          </div>
        </article>
      ))}
    </div>
  );
}

function AssetTable({
  type,
  items,
  renderActions,
}: {
  type: AssetType;
  items: AssetItem[];
  renderActions: Actions;
}) {
  return (
    <div role="table" aria-label={type === 'token' ? 'Tokens' : 'NFTs'} className="hidden md:block">
      <TableHeader type={type} />
      <div role="rowgroup" className={`mt-2 ${rowLayout[type].group}`}>
        {items.map((item) => (
          <div key={item.id} role="row" className={bodyRowClass(type)}>
            <div role="cell" className="min-w-0">
              <AssetIdentity item={item} />
            </div>
            {type === 'token' && (
              <div role="cell" className="text-center font-medium">
                {item.balance}
              </div>
            )}
            <div role="cell" className="text-center font-medium">
              {item.supplyPercent}%
            </div>
            <div role="cell">
              <MintProgress value={item.mintProgress} />
            </div>
            <div role="cell" className="flex items-center justify-center gap-1">
              {renderActions(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Cards below the md breakpoint, the design's table from md up. */
export function AssetList({
  type,
  items,
  renderActions,
}: {
  type: AssetType;
  items: AssetItem[];
  renderActions: Actions;
}) {
  if (!items.length) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-sm text-muted">
        No {type === 'token' ? 'tokens' : 'NFTs'} found.
      </div>
    );
  }
  return (
    <>
      <AssetCards type={type} items={items} renderActions={renderActions} />
      <AssetTable type={type} items={items} renderActions={renderActions} />
    </>
  );
}

export function IdentitySkeleton() {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <Skeleton className="size-11 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5 max-w-[220px] rounded" />
        <Skeleton className="h-3 w-2/5 max-w-[120px] rounded" />
      </div>
    </div>
  );
}

function ActionsSkeleton({ type }: { type: AssetType }) {
  return (
    <>
      <Skeleton className="h-8 w-[76px] rounded-full" />
      {type === 'token' && (
        <>
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </>
      )}
    </>
  );
}

/**
 * The list's loading placeholder, with the same cards, header, columns, and row heights, so
 * nothing moves when the data arrives. It is visual only; QueryState announces the loading.
 */
export function AssetListSkeleton({ type, rows }: { type: AssetType; rows: number }) {
  const keys = Array.from({ length: rows }, (_, index) => index);
  return (
    <>
      <div className="space-y-2 md:hidden">
        {keys.map((key) => (
          <div key={key} className="rounded-lg bg-white p-4">
            <IdentitySkeleton />
            {/* Sized as the real 16px label line, 4px gap, and 20px value line (margins collapse). */}
            <div className={`mt-4 grid gap-4 ${type === 'token' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {(type === 'token' ? [0, 1] : [0]).map((column) => (
                <div key={column}>
                  <Skeleton className="my-0.5 h-3 w-14 rounded" />
                  <Skeleton className="mt-2 mb-0.5 h-4 w-10 rounded" />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Skeleton className="h-[9px] w-full rounded-full" />
              <div className="flex shrink-0 items-center gap-1">
                <ActionsSkeleton type={type} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <TableHeader type={type} />
        <div className={`mt-2 ${rowLayout[type].group}`}>
          {keys.map((key) => (
            <div key={key} className={bodyRowClass(type)}>
              <IdentitySkeleton />
              {type === 'token' && <Skeleton className="mx-auto h-4 w-8 rounded" />}
              <Skeleton className="mx-auto h-4 w-12 rounded" />
              <Skeleton className="h-[9px] w-full rounded-full" />
              <div className="flex items-center justify-center gap-1">
                <ActionsSkeleton type={type} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
