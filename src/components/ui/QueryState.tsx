import type { ReactNode } from 'react';
import type { QueryResult } from '../../app/api';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';
import { Loading } from './Loading';

export function ErrorState({
  error,
  fallback,
  onRetry,
  className = 'space-y-3',
}: {
  error: unknown;
  fallback?: string;
  onRetry: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <ErrorMessage error={error} fallback={fallback} />
      <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

const panel = 'grid place-items-center rounded-lg bg-white p-8 text-center';

/**
 * Renders a query's data, or a loading or error state in place of it.
 * `isError` is false while a retry runs, so Try again switches back to the loading state.
 */
export function QueryState<T>({
  query,
  loadingLabel,
  errorFallback,
  className = panel,
  skeleton,
  children,
}: {
  query: QueryResult<T>;
  /** Announced while loading; also shown beside the spinner when there is no skeleton. */
  loadingLabel: string;
  errorFallback?: string;
  /** The box that holds the loading and error states. */
  className?: string;
  /** A placeholder shaped like the content, shown instead of the spinner while loading. */
  skeleton?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (query.isError) {
    return (
      <div className={className}>
        <ErrorState error={query.error} fallback={errorFallback} onRetry={() => query.refetch()} />
      </div>
    );
  }
  if (query.data === undefined && skeleton) {
    return (
      <div>
        <p role="status" className="sr-only">
          {loadingLabel}
        </p>
        <div aria-hidden="true">{skeleton}</div>
      </div>
    );
  }
  if (query.data === undefined) {
    return (
      <div className={className}>
        <Loading label={loadingLabel} />
      </div>
    );
  }
  return children(query.data);
}
