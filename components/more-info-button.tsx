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
      className="bg-gradient-to-r from-[#005a73] via-[#007B9C] to-[#005a73] text-white hover:from-[#004a5f] hover:via-[#006380] hover:to-[#004a5f] shadow-lg"
      onClick={() => {
        window.location.assign('#features');
      }}
    >
      {children} <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  );
}
