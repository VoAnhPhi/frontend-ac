import { NavLink } from 'react-router-dom';
import { AssetIdentity, IdentitySkeleton, tableText } from '../../components/assets/AssetList';
import { Skeleton } from '../../components/ui/Skeleton';
import type { AssetItem, AssetType } from '../assets/assetsApi';

const headers = {
  token: ['Token', 'Balance', '% of Supply', 'Total of Supply'],
  nft: ['NFT', '% of Supply', 'Total of Supply'],
};

// The design's 100px and 107px columns with 48px gaps from xl; narrower below so the table fits.
const columns = {
  token:
    'grid-cols-[minmax(0,1fr)_80px_80px_96px] gap-x-6 xl:grid-cols-[minmax(0,1fr)_100px_100px_107px] xl:gap-x-12',
  nft: 'grid-cols-[minmax(0,1fr)_80px_96px] gap-x-6 xl:grid-cols-[minmax(0,1fr)_100px_107px] xl:gap-x-12',
};

const rowClass = (type: AssetType) =>
  `grid h-[76px] items-center border-b border-surface px-4 leading-6 text-black ${tableText} ${columns[type]}`;

// The value columns of each type, with how each is aligned under its header.
function valueCells(item: AssetItem, type: AssetType) {
  return [
    ...(type === 'token' ? [{ label: 'Balance', value: item.balance, align: 'text-center' }] : []),
    { label: '% of Supply', value: `${item.supplyPercent}%`, align: 'text-center' },
    { label: 'Total of Supply', value: item.totalSupply, align: 'text-right' },
  ];
}

const tabs = [
  { to: '/profile/tokens', label: 'Tokens' },
  { to: '/profile/nfts', label: 'NFTs' },
];

/** Switches between the user's tokens and NFTs; each tab is its own URL. */
export function ProfileTabs() {
  return (
    <nav aria-label="Profile assets" className="flex gap-4">
      {tabs.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `rounded-lg px-4 py-1 leading-6 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-dark ${tableText} ${isActive ? 'bg-field text-ink' : 'text-muted hover:text-ink'}`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function HoldingCount({
  label,
  value,
  failed,
}: {
  label: string;
  value?: number;
  failed: boolean;
}) {
  return (
    <div className="rounded-lg bg-white px-6 py-4">
      <p className="text-sm text-muted">{label}</p>
      {value === undefined && !failed ? (
        <p className="mt-1 flex h-7 items-center sm:h-8">
          <Skeleton className="h-5 w-10 rounded" />
          <span className="sr-only">Loading</span>
        </p>
      ) : (
        <p className="mt-1 text-xl font-medium sm:text-2xl">{value ?? '-'}</p>
      )}
    </div>
  );
}

function TableHeader({ type }: { type: AssetType }) {
  const [nameHeader, ...valueHeaders] = headers[type];
  return (
    <div
      role="row"
      className={`grid h-14 items-center border-b border-surface px-4 leading-5 font-medium text-muted ${tableText} ${columns[type]}`}
    >
      <span role="columnheader" className="text-ink">
        {nameHeader}
      </span>
      {valueHeaders.map((header) => (
        <span
          key={header}
          role="columnheader"
          className={`whitespace-nowrap ${header === 'Total of Supply' ? 'justify-self-end' : 'justify-self-center'}`}
        >
          {header}
        </span>
      ))}
    </div>
  );
}

/** Stacked items below the md breakpoint, the design's table from md up. */
export function HoldingsList({ items, type }: { items: AssetItem[]; type: AssetType }) {
  if (!items.length) {
    return <p className="py-8 text-center text-sm text-muted">No assets found.</p>;
  }
  return (
    <>
      <ul className="md:hidden">
        {items.map((item) => (
          <li key={item.id} className="border-b border-surface py-4 last:border-0">
            <AssetIdentity item={item} />
            <dl className={`mt-4 grid gap-4 ${type === 'token' ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {valueCells(item, type).map((cell) => (
                <div key={cell.label}>
                  <dt className="text-xs text-muted">{cell.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-black">{cell.value}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <div role="table" aria-label={type === 'nft' ? 'NFTs' : 'Tokens'} className="hidden md:block">
        <TableHeader type={type} />
        <div role="rowgroup">
          {items.map((item) => (
            <div key={item.id} role="row" className={rowClass(type)}>
              <div role="cell" className="min-w-0">
                <AssetIdentity item={item} />
              </div>
              {valueCells(item, type).map((cell) => (
                <div key={cell.label} role="cell" className={`font-medium ${cell.align}`}>
                  {cell.value}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** The holdings' loading placeholder, with the real header, columns, and row heights. */
export function HoldingsSkeleton({ type, rows }: { type: AssetType; rows: number }) {
  const keys = Array.from({ length: rows }, (_, index) => index);
  const values = type === 'token' ? 3 : 2;
  return (
    <>
      <div className="md:hidden">
        {keys.map((key) => (
          <div key={key} className="border-b border-surface py-4 last:border-0">
            <IdentitySkeleton />
            <div className={`mt-4 grid gap-4 ${type === 'token' ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {Array.from({ length: values }, (_, column) => (
                <div key={column}>
                  <p className="text-xs">
                    <Skeleton inline className="h-3 w-14 rounded" />
                  </p>
                  <p className="mt-1 text-sm">
                    <Skeleton inline className="h-4 w-10 rounded" />
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        <TableHeader type={type} />
        {keys.map((key) => (
          <div key={key} className={rowClass(type)}>
            <IdentitySkeleton />
            {Array.from({ length: values }, (_, column) => (
              <Skeleton
                key={column}
                className={`h-4 w-10 rounded ${column === values - 1 ? 'ml-auto' : 'mx-auto'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
