export function Loading({ label = 'Loading' }: { label?: string }) {
  return <div role="status" className="inline-flex items-center gap-3 text-sm text-muted"><span className="size-5 animate-spin rounded-full border-2 border-brand border-r-transparent" aria-hidden="true" /><span>{label}</span></div>
}
