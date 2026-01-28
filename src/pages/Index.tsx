import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeatherDashboard } from '@/components/dashboard/WeatherDashboard';
import { StockDashboard } from '@/components/dashboard/StockDashboard';
import { SettingsDialog } from '@/components/dashboard/SettingsDialog';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  TrendingUp, 
  Database, 
  Zap,
  Github,
  Trash2
} from 'lucide-react';
import { cache } from '@/lib/api/cache';
import { useToast } from '@/hooks/use-toast';

const LOCAL_STORAGE_KEYS = {
  weatherApiKey: 'etl_weather_api_key',
  financeApiKey: 'etl_finance_api_key',
};

export default function Index() {
  const { toast } = useToast();
  const [weatherApiKey, setWeatherApiKey] = useState('');
  const [financeApiKey, setFinanceApiKey] = useState('');
  const [activeTab, setActiveTab] = useState('weather');

  useEffect(() => {
    // Load API keys from localStorage
    const savedWeatherKey = localStorage.getItem(LOCAL_STORAGE_KEYS.weatherApiKey) || '';
    const savedFinanceKey = localStorage.getItem(LOCAL_STORAGE_KEYS.financeApiKey) || '';
    setWeatherApiKey(savedWeatherKey);
    setFinanceApiKey(savedFinanceKey);
  }, []);

  const handleSaveWeatherKey = (key: string) => {
    setWeatherApiKey(key);
    localStorage.setItem(LOCAL_STORAGE_KEYS.weatherApiKey, key);
    toast({
      title: 'API Key Saved',
      description: 'OpenWeatherMap API key has been saved.',
    });
  };

  const handleSaveFinanceKey = (key: string) => {
    setFinanceApiKey(key);
    localStorage.setItem(LOCAL_STORAGE_KEYS.financeApiKey, key);
    toast({
      title: 'API Key Saved',
      description: 'Alpha Vantage API key has been saved.',
    });
  };

  const handleClearCache = () => {
    cache.clear();
    toast({
      title: 'Cache Cleared',
      description: 'All cached API responses have been cleared.',
    });
  };

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">ETL Pipeline</h1>
                <p className="text-xs text-muted-foreground">Live Data Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              className="border-border hover:border-primary/50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            <SettingsDialog
              weatherApiKey={weatherApiKey}
              financeApiKey={financeApiKey}
              onSaveWeatherKey={handleSaveWeatherKey}
              onSaveFinanceKey={handleSaveFinanceKey}
            />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Real-Time Data Analysis</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Dynamic ETL Pipeline &<br />
              <span className="text-gradient-primary">Live Graph Dashboard</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Extract, transform, and visualize real-time weather and financial data with 
              automatic caching, error handling, and beautiful interactive charts.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>Auto-refresh on parameter change</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>Local response caching</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-chart-amber" />
                <span>Modular architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger
              value="weather"
              className="data-[state=active]:bg-background data-[state=active]:text-primary gap-2"
            >
              <Cloud className="h-4 w-4" />
              Weather Data
            </TabsTrigger>
            <TabsTrigger
              value="finance"
              className="data-[state=active]:bg-background data-[state=active]:text-primary gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Finance Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weather" className="animate-fade-in">
            <WeatherDashboard apiKey={weatherApiKey} />
          </TabsContent>

          <TabsContent value="finance" className="animate-fade-in">
            <StockDashboard apiKey={financeApiKey} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Built with React, TypeScript, Recharts • ETL Pipeline Demo
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                OpenWeatherMap
              </a>
              <a
                href="https://www.alphavantage.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Alpha Vantage
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
