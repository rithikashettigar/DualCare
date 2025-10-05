import { Button } from '@/components/ui/button';
import { PhoneOutgoing } from 'lucide-react';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <main className="container mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
        {children}
      </main>
      <Button
        variant="destructive"
        size="lg"
        className="fixed bottom-6 right-6 rounded-full h-20 w-20 shadow-2xl animate-pulse"
        aria-label="SOS Emergency"
      >
        <div className="flex flex-col items-center">
          <PhoneOutgoing className="h-8 w-8" />
          <span className="font-bold text-lg">SOS</span>
        </div>
      </Button>
    </div>
  );
}
