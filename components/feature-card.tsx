import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group backdrop-blur-xl',
        className,
      )}
    >
      <div className="mb-5">{icon}</div>
      <h3 className="text-xl dark:text-foreground text-gray-300 font-semibold mb-3 group-hover:text-purple-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
