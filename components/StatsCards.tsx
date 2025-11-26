import React from 'react';
import { Users, DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import { DailyRecord } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface StatsCardsProps {
  data: DailyRecord[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  const totalLeads = data.reduce((acc, curr) => acc + curr.leads, 0);
  const totalSales = data.reduce((acc, curr) => acc + curr.sales, 0);
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
  
  // Calculate simple conversion rate
  const conversionRate = totalLeads > 0 ? ((totalSales / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-zinc-900 border-l-4 border-primary-500 rounded-lg p-6 shadow-lg shadow-black/50 hover:bg-zinc-800 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Total de Leads</p>
            <h3 className="text-3xl font-bold text-white mt-2">{formatNumber(totalLeads)}</h3>
          </div>
          <div className="p-3 bg-primary-500/10 rounded-full text-primary-500">
            <Users size={24} />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border-l-4 border-emerald-500 rounded-lg p-6 shadow-lg shadow-black/50 hover:bg-zinc-800 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Vendas Totais</p>
            <h3 className="text-3xl font-bold text-white mt-2">{formatNumber(totalSales)}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border-l-4 border-blue-500 rounded-lg p-6 shadow-lg shadow-black/50 hover:bg-zinc-800 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Faturamento</p>
            <h3 className="text-3xl font-bold text-white mt-2">{formatCurrency(totalRevenue)}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

       <div className="bg-zinc-900 border-l-4 border-violet-500 rounded-lg p-6 shadow-lg shadow-black/50 hover:bg-zinc-800 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">Conversão</p>
            <h3 className="text-3xl font-bold text-white mt-2">{conversionRate}%</h3>
          </div>
          <div className="p-3 bg-violet-500/10 rounded-full text-violet-500">
            <CreditCard size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};