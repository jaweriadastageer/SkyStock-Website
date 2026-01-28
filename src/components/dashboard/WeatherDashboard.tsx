import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatCard } from './StatCard';
import { WeatherCharts } from './WeatherCharts';
import { LoadingState, StatsSkeleton, ChartSkeleton } from './LoadingState';
import { runWeatherPipeline, WeatherPipelineResult, handlePipelineError } from '@/lib/etl/pipeline';
import { 
  Search, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  RefreshCw,
  MapPin
} from 'lucide-react';

interface WeatherDashboardProps {
  apiKey: string;
}

export function WeatherDashboard({ apiKey }: WeatherDashboardProps) {
  const { toast } = useToast();
  const [city, setCity] = useState('London');
  const [inputValue, setInputValue] = useState('London');
  const [data, setData] = useState<WeatherPipelineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (searchCity: string) => {
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please add your OpenWeatherMap API key in settings.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const result = await runWeatherPipeline(searchCity, apiKey);
      setData(result);
      setCity(searchCity);
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
      fetchData(city);
    }
  }, [apiKey]); // Only re-fetch when API key changes

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      fetchData(inputValue.trim());
    }
  };

  const handleRefresh = () => {
    fetchData(city);
  };

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10">
          <Thermometer className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Weather API Key Required</h3>
        <p className="text-muted-foreground max-w-md">
          Add your OpenWeatherMap API key in settings to start viewing weather data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter city name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
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
          {/* Current Weather Stats */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>{data.raw.current.city}</span>
              <span className="text-muted-foreground font-normal text-lg">
                {data.raw.current.country}
              </span>
              <span className="pulse-dot ml-2" />
            </h2>
            <p className="text-muted-foreground capitalize">{data.raw.current.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Temperature"
              value={Math.round(data.raw.current.temperature)}
              unit="°C"
              icon={<Thermometer className="h-6 w-6" />}
            />
            <StatCard
              label="Feels Like"
              value={Math.round(data.raw.current.feelsLike)}
              unit="°C"
              icon={<Thermometer className="h-6 w-6" />}
            />
            <StatCard
              label="Humidity"
              value={data.raw.current.humidity}
              unit="%"
              icon={<Droplets className="h-6 w-6" />}
            />
            <StatCard
              label="Wind Speed"
              value={data.raw.current.windSpeed}
              unit="m/s"
              icon={<Wind className="h-6 w-6" />}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Pressure" value={data.raw.current.pressure} unit="hPa" />
            <StatCard label="Visibility" value={(data.raw.current.visibility / 1000).toFixed(1)} unit="km" />
            <StatCard label="Cloudiness" value={data.raw.current.clouds} unit="%" />
            <StatCard label="Wind Direction" value={data.raw.current.windDeg} unit="°" />
          </div>

          {/* Charts */}
          <WeatherCharts
            hourlyForecast={data.transformed.hourlyForecast}
            dailyForecast={data.transformed.dailyForecast}
          />

          {/* ETL Metadata */}
          <div className="data-card">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Pipeline Metadata</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
            </div>
          </div>
        </>
      ) : (
        <LoadingState message="Enter a city to view weather data" />
      )}
    </div>
  );
}
