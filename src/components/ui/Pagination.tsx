import { Button } from './Button';

export function Pagination({
  label,
  page,
  pageCount,
  pageSize,
  total,
  shown,
  onPage,
}: {
  label: string;
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  /** How many items the current page holds. */
  shown: number;
  onPage: (page: number) => void;
}) {
  const first = (page - 1) * pageSize + 1;
  return (
    <nav
      aria-label={label}
      className="mt-2 flex items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 text-sm sm:justify-between"
    >
      <p className="hidden text-muted sm:block">
        Showing {first}–{first + shown - 1} of {total}
      </p>
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          Previous
        </Button>
        <span className="min-w-[88px] text-center text-xs sm:text-sm">
          Page {page} of {pageCount}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
