/**
 * A grey block that stands in for content while it loads. The caller sets its size and radius.
 * `inline` sits it inside a line of text, so the text element's line height keeps the real height.
 */
export function Skeleton({ className, inline = false }: { className: string; inline?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`${inline ? 'inline-block align-middle' : 'block'} bg-skeleton motion-safe:animate-pulse ${className}`}
    />
  );
}
