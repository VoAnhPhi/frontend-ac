import { Icon } from '../../components/ui/Icon';
import { Skeleton } from '../../components/ui/Skeleton';
import { useSyncedScroll } from '../../hooks/useSyncedScroll';
import type { LeaderboardRow } from './leaderboardApi';

// The design highlights one row; it stays at the same rank with live data.
const highlightedRank = 10;

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const compactUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

// Shown for values DummyJSON has no data for, such as the 24h change and volume.
const noData = '-';

function formatOptional(value: number | undefined, format: Intl.NumberFormat) {
  return value === undefined ? noData : format.format(value);
}

// Fixed shares, measured from the table at 1440px, so the columns do not move when the skeleton
// is replaced by rows whose text has a different length.
const columns = [
  { label: 'Rank', width: 'w-[5%]' },
  { label: 'Token', width: 'w-[29%]' },
  { label: 'Creator', width: 'w-[15.5%]' },
  { label: '24h Chg', width: 'w-[12%]' },
  { label: 'Market Cap', width: 'w-[13%]' },
  { label: 'Volume (24h)', width: 'w-[13%]' },
  { label: 'Token Price', width: 'w-[12.5%]' },
];

const tableClass =
  'w-full min-w-[980px] table-fixed border-separate border-spacing-0 text-left text-sm';

function TableHead() {
  return (
    <thead className="text-[#00706e] xl:sticky xl:top-4 xl:z-20">
      <tr className="h-12">
        {columns.map(({ label, width }) => (
          <th
            key={label}
            scope="col"
            className={`${width} border-b border-[#c7dddd] bg-[#d9f1f1] px-3 font-medium first:rounded-l-lg last:rounded-r-lg`}
          >
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TokenCell({ row, inverted }: { row: LeaderboardRow; inverted: boolean }) {
  return (
    <div className="flex min-w-[170px] items-center gap-2">
      <img src={row.icon} alt="" className="size-6 shrink-0 rounded-full object-cover" />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-medium">{row.token}</p>
        <div
          className={`flex items-center gap-1 text-xs ${inverted ? 'text-white/75' : 'text-muted'}`}
        >
          <span className="truncate">{row.sku}</span>
          <Icon name="copy" size={12} className={inverted ? 'text-white/75' : 'text-muted'} />
          {inverted && <Icon name="close" size={10} className="text-white/75" />}
        </div>
      </div>
    </div>
  );
}

function Row({ row }: { row: LeaderboardRow }) {
  const highlighted = row.rank === highlightedRank;
  // Every cell paints the row's background, so the highlighted row can round its outer corners.
  const cell = highlighted
    ? 'px-3 transition-colors bg-brand group-hover:bg-[#00a39e] first:rounded-l-lg last:rounded-r-lg'
    : 'px-3 transition-colors border-b border-[#e4e8e8] bg-transparent group-hover:bg-brand-soft';
  const missing = highlighted ? 'text-white/75' : 'text-muted';

  return (
    <tr
      className={`group h-[54px] transition-colors duration-150 ${highlighted ? 'text-white' : ''}`}
    >
      <td className={`${cell} font-medium ${highlighted ? 'text-white' : 'text-muted'}`}>
        #{row.rank}
      </td>
      <td className={cell}>
        <TokenCell row={row} inverted={highlighted} />
      </td>
      <td className={cell}>{row.creator ?? 'N/A'}</td>
      <td className={`${cell} ${missing}`}>{noData}</td>
      <td className={cell}>{formatOptional(row.marketCap, compactUsd)}</td>
      <td className={`${cell} ${missing}`}>{noData}</td>
      <td className={cell}>{formatOptional(row.price, usd)}</td>
    </tr>
  );
}

/** Below xl the table scrolls sideways, with a second scrollbar kept in sync above it. */
export function LeaderboardTable({ rows, caption }: { rows: LeaderboardRow[]; caption: string }) {
  const scroll = useSyncedScroll<HTMLDivElement>();
  return (
    <>
      <div
        {...scroll.first}
        role="region"
        aria-label="Scroll leaderboard horizontally"
        tabIndex={0}
        className="sticky top-0 z-30 mt-2 h-4 max-w-full overflow-x-auto overflow-y-hidden bg-[#f5fbfb] xl:hidden"
      >
        <div className="h-px w-[980px]" />
      </div>
      <div
        {...scroll.second}
        className="mt-1 max-w-full overflow-x-auto xl:mt-4 xl:overflow-visible"
      >
        <table className={tableClass}>
          <caption className="sr-only">{caption}</caption>
          <TableHead />
          <tbody>
            {rows.map((row) => (
              <Row key={row.rank} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// One bar per value column, sized like the text it stands in for; the token column is built below.
const valueBars = ['w-20', 'w-4', 'w-14', 'w-4', 'w-14'];

/** The leaderboard's loading placeholder: the real header, row height, and spacing. */
export function LeaderboardTableSkeleton({ rows }: { rows: number }) {
  const cell = 'border-b border-[#e4e8e8] px-3';
  return (
    <>
      {/* Holds the place of the extra scrollbar the real table has below xl. */}
      <div className="mt-2 h-4 xl:hidden" />
      <div className="mt-1 max-w-full overflow-hidden xl:mt-4 xl:overflow-visible">
        <table className={tableClass}>
          <TableHead />
          <tbody>
            {Array.from({ length: rows }, (_, row) => (
              <tr key={row} className="h-[54px]">
                <td className={cell}>
                  <Skeleton className="h-3.5 w-6 rounded" />
                </td>
                <td className={cell}>
                  <div className="flex min-w-[170px] items-center gap-2">
                    <Skeleton className="size-6 shrink-0 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-28 rounded" />
                      <Skeleton className="h-2.5 w-20 rounded" />
                    </div>
                  </div>
                </td>
                {valueBars.map((width, column) => (
                  <td key={column} className={cell}>
                    <Skeleton className={`h-3.5 rounded ${width}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
