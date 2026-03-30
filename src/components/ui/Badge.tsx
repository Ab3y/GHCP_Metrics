import type { ReactNode } from 'react';

const variantClasses = {
  cyan: 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30',
  magenta: 'bg-neon-magenta/15 text-neon-magenta border-neon-magenta/30',
  lime: 'bg-neon-lime/15 text-neon-lime border-neon-lime/30',
  orange: 'bg-neon-orange/15 text-neon-orange border-neon-orange/30',
  purple: 'bg-neon-purple/15 text-neon-purple border-neon-purple/30',
} as const;

interface BadgeProps {
  children: ReactNode;
  variant?: keyof typeof variantClasses;
}

export function Badge({ children, variant = 'cyan' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
