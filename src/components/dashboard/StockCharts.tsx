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
  ComposedChart,
} from 'recharts';
import { TransformedStockData, StockAnalytics } from '@/lib/etl/transform';

interface StockChartsProps {
  timeSeries: TransformedStockData[];
  analytics: StockAnalytics;
  ma7: number[];
  ma20: number[];
}

const chartColors = {
  primary: 'hsl(187, 92%, 50%)',
  accent: 'hsl(160, 84%, 45%)',
  amber: 'hsl(38, 92%, 55%)',
  rose: 'hsl(350, 89%, 60%)',
  violet: 'hsl(263, 70%, 58%)',
  muted: 'hsl(215, 20%, 55%)',
  grid: 'hsl(222, 30%, 18%)',
  up: 'hsl(160, 84%, 45%)',
  down: 'hsl(0, 84%, 60%)',
};

export function PriceChart({ data, ma7, ma20 }: { data: TransformedStockData[]; ma7: number[]; ma20: number[] }) {
  const chartData = data.map((item, i) => ({
    ...item,
    ma7: ma7[i],
    ma20: ma20[i],
  }));

  return (
    <div className="data-card">
      <h3 className="text-lg font-semibold mb-4">Price History</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: chartColors.muted, fontSize: 11 }}
              axisLine={{ stroke: chartColors.grid }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)',
              }}
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}`,
                name === 'close' ? 'Close' : name === 'ma7' ? 'MA(7)' : 'MA(20)',
              ]}
            />
            <Legend wrapperStyle={{ color: chartColors.muted }} />
            <Area
              type="monotone"
              dataKey="close"
              name="Close"
              stroke={chartColors.primary}
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
            <Line
              type="monotone"
              dataKey="ma7"
              name="MA(7)"
              stroke={chartColors.accent}
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 4"
            />
            <Line
              type="monotone"
              dataKey="ma20"
              name="MA(20)"
              stroke={chartColors.amber}
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function VolumeChart({ data }: { data: TransformedStockData[] }) {
  const chartData = data.map(item => ({
    ...item,
    fillColor: item.change >= 0 ? chartColors.up : chartColors.down,
  }));

  return (
    <div className="data-card">
      <h3 className="text-lg font-semibold mb-4">Trading Volume</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: chartColors.muted, fontSize: 11 }}
              axisLine={{ stroke: chartColors.grid }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)',
              }}
              formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M`, 'Volume']}
            />
            <Bar
              dataKey="volume"
              radius={[2, 2, 0, 0]}
              fill={chartColors.violet}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function OHLCChart({ data }: { data: TransformedStockData[] }) {
  return (
    <div className="data-card">
      <h3 className="text-lg font-semibold mb-4">High / Low Range</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: chartColors.muted, fontSize: 11 }}
              axisLine={{ stroke: chartColors.grid }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: chartColors.muted, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)',
              }}
              formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}
            />
            <Legend wrapperStyle={{ color: chartColors.muted }} />
            <Line
              type="monotone"
              dataKey="high"
              name="High"
              stroke={chartColors.accent}
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="low"
              name="Low"
              stroke={chartColors.rose}
              strokeWidth={1.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StockCharts({ timeSeries, analytics, ma7, ma20 }: StockChartsProps) {
  return (
    <div className="space-y-6">
      <PriceChart data={timeSeries} ma7={ma7} ma20={ma20} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolumeChart data={timeSeries} />
        <OHLCChart data={timeSeries} />
      </div>
    </div>
  );
}
