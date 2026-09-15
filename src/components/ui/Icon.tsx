export type IconName =
  | 'copy'
  | 'twitter'
  | 'telegram'
  | 'github'
  | 'avatar'
  | 'header-avatar'
  | 'chevron'
  | 'menu-token'
  | 'menu-nft'
  | 'profile'
  | 'logout';

const nativeSize: Partial<Record<IconName, number>> = {
  profile: 18,
  logout: 18,
  chevron: 12,
  copy: 16,
};

export function Icon({
  name,
  size,
  className = '',
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const resolvedSize = size ?? nativeSize[name] ?? 20;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: resolvedSize, height: resolvedSize }}
    >
      <img src={`/figma/${name}.svg`} alt="" className="block size-full object-contain" />
    </span>
  );
}
