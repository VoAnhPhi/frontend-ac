export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark ${checked ? 'bg-brand-dark' : 'bg-[#d9d9d9]'}`}
    >
      <span
        className={`absolute top-1 size-5 rounded-full bg-white transition ${checked ? 'left-6' : 'left-1'}`}
      />
    </button>
  );
}
