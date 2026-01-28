import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatCard } from './StatCard';
import { StockCharts } from './StockCharts';
import { LoadingState, StatsSkeleton, ChartSkeleton } from './LoadingState';
import { runStockPipeline, StockPipelineResult, handlePipelineError } from '@/lib/etl/pipeline';
import { TimeInterval } from '@/lib/api/finance';
import {
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  RefreshCw,
  DollarSign,
} from 'lucide-react';

interface StockDashboardProps {
  apiKey: string;
}

export function StockDashboard({ apiKey }: StockDashboardProps) {
  const { toast } = useToast();
  const [symbol, setSymbol] = useState('AAPL');
  const [inputValue, setInputValue] = useState('AAPL');
  const [interval, setInterval] = useState<TimeInterval>('daily');
  const [data, setData] = useState<StockPipelineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (searchSymbol: string, selectedInterval: TimeInterval) => {
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please add your Alpha Vantage API key in settings.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await runStockPipeline(searchSymbol.toUpperCase(), selectedInterval, apiKey);
      setData(result);
      setSymbol(searchSymbol.toUpperCase());
      setLastUpdated(new Date());
    } catch (error) {
      const pipelineError = handlePipelineError(error);
      toast({
        title: 'Error',
        description: pipelineError.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [apiKey, toast]);

  useEffect(() => {
    if (apiKey) {
      fetchData(symbol, interval);
    }
  }, [apiKey]); // Only re-fetch when API key changes

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      fetchData(inputValue.trim(), interval);
    }
  };

  const handleIntervalChange = (newInterval: TimeInterval) => {
    setInterval(newInterval);
    fetchData(symbol, newInterval);
  };

  const handleRefresh = () => {
    fetchData(symbol, interval);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(2)}B`;
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(2)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(2)}K`;
    return volume.toString();
  };

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10">
          <TrendingUp className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Finance API Key Required</h3>
        <p className="text-muted-foreground max-w-md">
          Add your Alpha Vantage API key in settings to start viewing stock data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Symbol (e.g., AAPL)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.toUpperCase())}
              className="pl-9 bg-secondary border-border uppercase"
              maxLength={5}
            />
          </div>
          <Select value={interval} onValueChange={(v) => handleIntervalChange(v as TimeInterval)}>
            <SelectTrigger className="w-32 bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
            className="border-border hover:border-primary/50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {loading && !data ? (
        <>
          <StatsSkeleton />
          <ChartSkeleton />
        </>
      ) : data ? (
        <>
          {/* Stock Quote Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold font-mono">{data.raw.quote.symbol}</h2>
              <span className="text-3xl font-bold text-gradient-primary">
                ${formatPrice(data.raw.quote.price)}
              </span>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded ${
                  data.raw.quote.change >= 0
                    ? 'bg-accent/20 text-accent'
                    : 'bg-destructive/20 text-destructive'
                }`}
              >
                {data.raw.quote.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-mono font-semibold">
                  {data.raw.quote.change >= 0 ? '+' : ''}
                  {formatPrice(data.raw.quote.change)} ({data.raw.quote.changePercent.toFixed(2)}%)
                </span>
              </div>
              <span className="pulse-dot" />
            </div>
            <p className="text-muted-foreground">
              {interval.charAt(0).toUpperCase() + interval.slice(1)} data • {data.transformed.timeSeries.length} data points
            </p>
          </div>

          {/* Quote Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Open"
              value={`$${formatPrice(data.raw.quote.open)}`}
              icon={<BarChart3 className="h-6 w-6" />}
            />
            <StatCard
              label="High"
              value={`$${formatPrice(data.raw.quote.high)}`}
              trend="up"
              icon={<TrendingUp className="h-6 w-6" />}
            />
            <StatCard
              label="Low"
              value={`$${formatPrice(data.raw.quote.low)}`}
              trend="down"
              icon={<TrendingDown className="h-6 w-6" />}
            />
            <StatCard
              label="Volume"
              value={formatVolume(data.raw.quote.volume)}
              icon={<Activity className="h-6 w-6" />}
            />
          </div>

          {/* Analytics Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Avg Price"
              value={`$${formatPrice(data.transformed.analytics.avgPrice)}`}
            />
            <StatCard
              label="Period High"
              value={`$${formatPrice(data.transformed.analytics.highestPrice)}`}
            />
            <StatCard
              label="Period Low"
              value={`$${formatPrice(data.transformed.analytics.lowestPrice)}`}
            />
            <StatCard
              label="Volatility"
              value={`${data.transformed.analytics.volatility.toFixed(2)}%`}
              trend={
                data.transformed.analytics.trend === 'bullish'
                  ? 'up'
                  : data.transformed.analytics.trend === 'bearish'
                  ? 'down'
                  : 'neutral'
              }
              trendValue={data.transformed.analytics.trend}
            />
          </div>

          {/* Charts */}
          <StockCharts
            timeSeries={data.transformed.timeSeries}
            analytics={data.transformed.analytics}
            ma7={data.transformed.ma7}
            ma20={data.transformed.ma20}
          />

          {/* ETL Metadata */}
          <div className="data-card">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pipeline Metadata</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Extracted: </span>
                <span className="font-mono">{new Date(data.metadata.extractedAt).toLocaleTimeString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Transformed: </span>
                <span className="font-mono">{new Date(data.metadata.transformedAt).toLocaleTimeString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Processing: </span>
                <span className="font-mono">{data.metadata.transformedAt - data.metadata.extractedAt}ms</span>
              </div>
              <div>
                <span className="text-muted-foreground">Interval: </span>
                <span className="font-mono capitalize">{data.metadata.interval}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <LoadingState message="Enter a stock symbol to view data" />
      )}
    </div>
  );
}
