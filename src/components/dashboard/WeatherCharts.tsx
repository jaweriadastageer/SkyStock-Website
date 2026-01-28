import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { TransformedForecast, DailyAggregate } from '@/lib/etl/transform';

interface WeatherChartsProps {
  hourlyForecast: TransformedForecast[];
  dailyForecast: DailyAggregate[];
}

const chartColors = {
  primary: 'hsl(187, 92%, 50%)',
  accent: 'hsl(160, 84%, 45%)',
  amber: 'hsl(38, 92%, 55%)',
  rose: 'hsl(350, 89%, 60%)',
  muted: 'hsl(215, 20%, 55%)',
  grid: 'hsl(222, 30%, 18%)',
};

export function HourlyTemperatureChart({ data }: { data: TransformedForecast[] }) {
  return (
    <div className="data-card">
      <h3 className="text-lg font-semibold mb-4">Hourly Temperature</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.slice(0, 16)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              axisLine={{ stroke: chartColors.grid }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)',
              }}
              formatter={(value: number) => [`${value}°C`, 'Temperature']}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke={chartColors.primary}
              strokeWidth={2}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DailyForecastChart({ data }: { data: DailyAggregate[] }) {
  return (
    <div className="data-card">
      <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              axisLine={{ stroke: chartColors.grid }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)',
              }}
            />
            <Legend wrapperStyle={{ color: chartColors.muted }} />
            <Bar dataKey="minTemp" name="Min" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="maxTemp" name="Max" fill={chartColors.amber} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function HumidityWindChart({ data }: { data: DailyAggregate[] }) {
  return (
    <div className="data-card">
      <h3 className="text-lg font-semibold mb-4">Humidity & Wind</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              axisLine={{ stroke: chartColors.grid }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}m/s`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)',
              }}
            />
            <Legend wrapperStyle={{ color: chartColors.muted }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avgHumidity"
              name="Humidity"
              stroke={chartColors.accent}
              strokeWidth={2}
              dot={{ fill: chartColors.accent, strokeWidth: 0 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgWindSpeed"
              name="Wind Speed"
              stroke={chartColors.rose}
              strokeWidth={2}
              dot={{ fill: chartColors.rose, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function WeatherCharts({ hourlyForecast, dailyForecast }: WeatherChartsProps) {
  return (
    <div className="space-y-6">
      <HourlyTemperatureChart data={hourlyForecast} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyForecastChart data={dailyForecast} />
        <HumidityWindChart data={dailyForecast} />
      </div>
    </div>
  );
}
