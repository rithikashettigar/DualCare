import { cn } from '@/lib/utils';
import { HeartPulse } from 'lucide-react';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-xl font-bold font-headline text-primary',
        className
      )}
    >
      <HeartPulse className="h-7 w-7" />
      <span className="hidden sm:inline-block">DualCare Connect</span>
    </Link>
  );
}
