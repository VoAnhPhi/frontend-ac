import { getErrorMessage } from '../../app/api';

/** Renders a request error as a message, or nothing when there is no error. */
export function ErrorMessage({
  error,
  fallback,
  className = '',
}: {
  error: unknown;
  fallback?: string;
  className?: string;
}) {
  if (!error) return null;
  return (
    <p role="alert" className={`text-sm text-red-600 ${className}`}>
      {getErrorMessage(error, fallback)}
    </p>
  );
}
