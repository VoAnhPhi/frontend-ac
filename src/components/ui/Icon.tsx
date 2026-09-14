type IconName = 'copy' | 'twitter' | 'telegram' | 'github' | 'avatar' | 'header-avatar' | 'chevron' | 'menu-token' | 'menu-nft' | 'profile' | 'logout'

export function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  return <img src={`/figma/${name}.svg`} width={size} height={size} alt="" aria-hidden="true" className={`inline-block shrink-0 object-contain ${className}`} />
}
