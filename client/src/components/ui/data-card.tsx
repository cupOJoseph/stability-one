import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DataCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DataCard({ children, className }: DataCardProps) {
  return (
    <Card className={cn('bg-white hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}
