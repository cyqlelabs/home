'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface MoreInfoButtonProps {
  children: React.ReactNode;
}

export default function MoreInfoButton({ children }: MoreInfoButtonProps) {
  return (
    <Button
      size="lg"
      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
      onClick={() => {
        window.location.assign('#features');
      }}
    >
      {children} <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  );
}
