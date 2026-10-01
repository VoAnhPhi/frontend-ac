import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from './Icon';

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: IconName;
  label: string;
  tone?: 'default' | 'danger';
};

export function IconButton({
  icon,
  label,
  tone = 'default',
  className = '',
  ...props
}: IconButtonProps) {
  const tones = {
    default: 'hover:bg-field hover:text-brand-dark',
    danger: 'hover:bg-red-50 hover:text-red-600',
  };
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={`grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors focus-visible:outline-2 focus-visible:outline-brand-dark disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}
