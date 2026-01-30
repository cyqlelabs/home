import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

function parseDescription(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return (
        <span key={index} className="text-[#FF7600] font-semibold">
          {content}
        </span>
      );
    }
    return part;
  });
}

export default function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-[#FF7600]/50 transition-all duration-300 group backdrop-blur-xl',
        className,
      )}
    >
      <div className="mb-5">{icon}</div>
      <h3 className="text-xl dark:text-foreground text-gray-300 font-semibold mb-3 group-hover:text-[#FF7600] transition-colors">
        {title}
      </h3>
      <p className="text-gray-400">{parseDescription(description)}</p>
    </div>
  );
}
