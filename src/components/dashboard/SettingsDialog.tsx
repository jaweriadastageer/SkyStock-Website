import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Key, CheckCircle } from 'lucide-react';

interface SettingsDialogProps {
  weatherApiKey: string;
  financeApiKey: string;
  onSaveWeatherKey: (key: string) => void;
  onSaveFinanceKey: (key: string) => void;
}

export function SettingsDialog({
  weatherApiKey,
  financeApiKey,
  onSaveWeatherKey,
  onSaveFinanceKey,
}: SettingsDialogProps) {
  const [weatherKey, setWeatherKey] = useState(weatherApiKey);
  const [financeKey, setFinanceKey] = useState(financeApiKey);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSaveWeatherKey(weatherKey);
    onSaveFinanceKey(financeKey);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="border-border hover:border-primary/50">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            API Settings
          </DialogTitle>
          <DialogDescription>
            Configure your API keys for weather and finance data.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="weather-key" className="flex items-center gap-2">
              OpenWeatherMap API Key
              {weatherApiKey && <CheckCircle className="h-3 w-3 text-accent" />}
            </Label>
            <Input
              id="weather-key"
              type="password"
              placeholder="Enter your OpenWeatherMap API key"
              value={weatherKey}
              onChange={(e) => setWeatherKey(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Get a free key at{' '}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                openweathermap.org
              </a>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="finance-key" className="flex items-center gap-2">
              Alpha Vantage API Key
              {financeApiKey && <CheckCircle className="h-3 w-3 text-accent" />}
            </Label>
            <Input
              id="finance-key"
              type="password"
              placeholder="Enter your Alpha Vantage API key"
              value={financeKey}
              onChange={(e) => setFinanceKey(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Get a free key at{' '}
              <a
                href="https://www.alphavantage.co/support/#api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                alphavantage.co
              </a>
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Keys</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
