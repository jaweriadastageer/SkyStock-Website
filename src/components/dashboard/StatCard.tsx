import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <div className={cn('data-card group', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="stat-label">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="stat-value text-foreground">{value}</span>
            {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                trend === 'up' && 'text-accent',
                trend === 'down' && 'text-destructive',
                trend === 'neutral' && 'text-muted-foreground'
              )}
            >
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-primary opacity-60 group-hover:opacity-100 transition-opacity">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
