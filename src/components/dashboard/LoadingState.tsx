import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading data...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        <Loader2 className="h-10 w-10 text-primary animate-spin relative" />
      </div>
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="data-card animate-pulse">
      <div className="h-5 w-32 bg-muted rounded mb-4" />
      <div className="chart-container bg-muted/30 rounded-lg flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-muted-foreground/50 animate-spin" />
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="data-card animate-pulse">
          <div className="h-3 w-16 bg-muted rounded mb-2" />
          <div className="h-8 w-24 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}
