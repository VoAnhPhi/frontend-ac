import {
  BookOpen,
  CaretDown,
  Copy,
  GithubLogo,
  House,
  List,
  Plus,
  SignOut,
  TelegramLogo,
  UserCircle,
  X,
  XLogo,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';

export type IconName =
  | 'copy'
  | 'twitter'
  | 'telegram'
  | 'github'
  | 'avatar'
  | 'header-avatar'
  | 'chevron'
  | 'home'
  | 'menu-token'
  | 'menu-nft'
  | 'profile'
  | 'logout'
  | 'menu'
  | 'close'
  | 'plus'
  | 'documentation';

const icons: Partial<Record<IconName, PhosphorIcon>> = {
  copy: Copy,
  twitter: XLogo,
  telegram: TelegramLogo,
  github: GithubLogo,
  chevron: CaretDown,
  home: House,
  profile: UserCircle,
  logout: SignOut,
  menu: List,
  close: X,
  plus: Plus,
  documentation: BookOpen,
};

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
  const AssetIcon = icons[name];

  if (AssetIcon) {
    return (
      <AssetIcon
        aria-hidden="true"
        size={resolvedSize}
        weight="regular"
        className={`shrink-0 ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: resolvedSize, height: resolvedSize }}
    >
      <img
        src={`/figma/${name}.svg`}
        alt=""
        className={`block size-full object-contain ${name === 'menu-token' || name === 'menu-nft' ? 'opacity-70' : ''}`}
      />
    </span>
  );
}
