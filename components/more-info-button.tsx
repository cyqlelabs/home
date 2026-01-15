'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface MoreInfoButtonProps {
  children: React.ReactNode;
}

export default function MoreInfoButton({ children }: MoreInfoButtonProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500"
      onClick={() => {
        window.location.assign('#features');
      }}
    >
      {children} <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  );
}
