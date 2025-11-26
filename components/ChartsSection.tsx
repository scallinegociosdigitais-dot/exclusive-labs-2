import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { DailyRecord } from '../types';
import { formatDate, formatCurrency } from '../utils/formatters';

interface ChartsSectionProps {
  data: DailyRecord[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ data }) => {
  // Sort data by date for charts
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  // Calculate cumulative sales and scheduled for "Growth" charts
  const cumulativeData = useMemo(() => {
    let totalSales = 0;
    let totalScheduled = 0;
    return sortedData.map(record => {
      totalSales += record.sales;
      totalScheduled += record.scheduled;
      return {
        ...record,
        cumulativeSales: totalSales,
        cumulativeScheduled: totalScheduled
      };
    });
  }, [sortedData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Agendamento vs Vendas (Funnel) */}
      <div className="bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-6 border-b border-zinc-800 pb-2 flex items-center gap-2">
          <span className="w-2 h-6 bg-primary-500 rounded-sm"></span>
          Funil: Agendamentos vs. Vendas
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sortedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScheduled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                stroke="#71717a" 
                tick={{fill: '#71717a', fontSize: 12}}
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                tick={{fill: '#71717a', fontSize: 12}}
                tickLine={false}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                labelFormatter={formatDate}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area 
                type="monotone" 
                dataKey="scheduled" 
                name="Agendados"
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorScheduled)" 
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                name="Vendas"
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorSales)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Investment vs Sales Progression */}
      <div className="bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-6 border-b border-zinc-800 pb-2 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-sm"></span>
          ROI: Investimento vs. Faturamento
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sortedData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                stroke="#71717a" 
                tick={{fill: '#71717a', fontSize: 12}}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left" 
                stroke="#71717a" 
                tick={{fill: '#71717a', fontSize: 12}}
                tickLine={false}
                tickFormatter={(value) => `R$${value/1000}k`}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#ef4444" 
                tick={{fill: '#ef4444', fontSize: 12}}
                tickLine={false}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                 formatter={(value: number) => formatCurrency(value)}
                 labelFormatter={formatDate}
              />
              <Legend verticalAlign="top" height={36}/>
              <Bar 
                yAxisId="right" 
                dataKey="investment" 
                name="Investimento"
                barSize={20} 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="revenue" 
                name="Faturamento"
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#18181b'}}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Scheduled Growth */}
      <div className="lg:col-span-2 bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-6 border-b border-zinc-800 pb-2 flex items-center gap-2">
          <span className="w-2 h-6 bg-orange-500 rounded-sm"></span>
          Curva de Crescimento de Agendamentos (Acumulado)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumulativeScheduled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                stroke="#71717a" 
                tick={{fill: '#71717a', fontSize: 12}}
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                tick={{fill: '#71717a', fontSize: 12}}
                tickLine={false}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                labelFormatter={formatDate}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area 
                type="monotone" 
                dataKey="cumulativeScheduled" 
                name="Agendamentos Acumulados" 
                stroke="#f97316" 
                fillOpacity={1} 
                fill="url(#colorCumulativeScheduled)" 
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Sales Growth */}
      <div className="lg:col-span-2 bg-zinc-900 rounded-xl p-6 shadow-lg border border-zinc-800">
        <h3 className="text-lg font-semibold text-white mb-6 border-b border-zinc-800 pb-2 flex items-center gap-2">
          <span className="w-2 h-6 bg-emerald-500 rounded-sm"></span>
          Curva de Crescimento de Vendas (Acumulado)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumulativeSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                stroke="#71717a" 
                tick={{fill: '#71717a', fontSize: 12}}
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                tick={{fill: '#71717a', fontSize: 12}}
                tickLine={false}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                labelFormatter={formatDate}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area 
                type="monotone" 
                dataKey="cumulativeSales" 
                name="Vendas Acumuladas" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorCumulativeSales)" 
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
