import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, Filter, X, RotateCcw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { DailyRecord } from './types';
import { StatsCards } from './components/StatsCards';
import { ChartsSection } from './components/ChartsSection';
import { DataTable } from './components/DataTable';
import { DataEntryModal } from './components/DataEntryModal';

// Initial dummy data to populate the dashboard for demonstration
const INITIAL_DATA: DailyRecord[] = [
  {
    id: '1',
    date: '2023-10-01',
    leads: 45,
    source: 'Facebook Ads',
    contacts: 40,
    scheduled: 12,
    attended: 8,
    testDrives: 6,
    approvals: 4,
    sales: 2,
    revenue: 120000,
    investment: 1500
  },
  {
    id: '2',
    date: '2023-10-02',
    leads: 52,
    source: 'Google Ads',
    contacts: 48,
    scheduled: 15,
    attended: 10,
    testDrives: 8,
    approvals: 5,
    sales: 3,
    revenue: 185000,
    investment: 1600
  },
  {
    id: '3',
    date: '2023-10-03',
    leads: 38,
    source: 'Instagram',
    contacts: 35,
    scheduled: 8,
    attended: 6,
    testDrives: 5,
    approvals: 2,
    sales: 1,
    revenue: 55000,
    investment: 1200
  },
  {
    id: '4',
    date: '2023-10-04',
    leads: 65,
    source: 'Facebook Ads',
    contacts: 60,
    scheduled: 20,
    attended: 15,
    testDrives: 12,
    approvals: 8,
    sales: 5,
    revenue: 310000,
    investment: 2000
  },
  {
    id: '5',
    date: '2023-10-05',
    leads: 55,
    source: 'Indicação',
    contacts: 55,
    scheduled: 18,
    attended: 14,
    testDrives: 10,
    approvals: 7,
    sales: 4,
    revenue: 240000,
    investment: 1800
  }
];

function App() {
  const [records, setRecords] = useState<DailyRecord[]>(() => {
    // Try to load from local storage
    const saved = localStorage.getItem('redpulse_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DailyRecord | undefined>(undefined);
  
  // Date filter state
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    localStorage.setItem('redpulse_data', JSON.stringify(records));
  }, [records]);

  // Filter records for the Dashboard (Table + Charts + KPIs + Export)
  // Moved up so it can be used in handleExport
  const filteredRecords = records.filter(record => {
    const recordDate = record.date;
    const { start, end } = dateRange;
    if (start && recordDate < start) return false;
    if (end && recordDate > end) return false;
    return true;
  });

  const generateId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSave = (recordData: Omit<DailyRecord, 'id'>) => {
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...recordData, id: r.id } : r));
    } else {
      const newRecord: DailyRecord = {
        ...recordData,
        id: generateId()
      };
      setRecords(prev => [...prev, newRecord]);
    }
  };

  const handleEdit = (record: DailyRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  // Direct delete function with robust ID checking
  const handleDelete = (id: string) => {
    console.log('Tentando excluir registro:', id);
    
    setRecords(prev => {
      const filtered = prev.filter(r => String(r.id) !== String(id));
      console.log('Registros restantes:', filtered.length);
      return filtered;
    });

    // Clear editing record if it was the one deleted
    if (editingRecord && String(editingRecord.id) === String(id)) {
      setEditingRecord(undefined);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Isso restaurará os dados de exemplo iniciais e apagará suas alterações atuais. Deseja continuar?')) {
      setRecords(INITIAL_DATA);
      setDateRange({ start: '', end: '' });
      console.log('Dados restaurados para o padrão.');
    }
  };

  const handleAddNew = () => {
    setEditingRecord(undefined);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    // Export filteredRecords instead of all records
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dados de Vendas");
    XLSX.writeFile(wb, "exclusive_labs_relatorio_vendas.xlsx");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-primary-500/30">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/50">
               <BarChart3 size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Exclusive <span className="text-primary-500">Labs</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary-900/20 active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Novo Registro</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Section & Global Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-white">Visão Geral</h2>
              <p className="text-zinc-400">Acompanhe o desempenho diário e métricas de conversão.</p>
            </div>

            {/* Global Date Filter */}
            <div className="bg-zinc-900 rounded-xl p-1.5 border border-zinc-800 flex flex-col sm:flex-row items-center gap-2 shadow-sm self-start md:self-auto w-full md:w-auto overflow-x-auto">
               <div className="flex items-center gap-2 px-3 py-2 text-zinc-400 border-r border-zinc-800/50 mr-1 hidden sm:flex">
                <Filter size={16} className="text-primary-500" />
                <span className="font-medium text-xs uppercase tracking-wider text-zinc-500">Filtrar</span>
              </div>
              
              <div className="flex flex-row gap-2 items-center w-full sm:w-auto p-1">
                <div className="relative group w-full sm:w-auto min-w-[120px]">
                   <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">De</span>
                   </div>
                   <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 pl-8 pr-2 text-xs text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none w-full [color-scheme:dark]"
                  />
                </div>
                
                <div className="relative group w-full sm:w-auto min-w-[120px]">
                   <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Até</span>
                   </div>
                   <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 pl-8 pr-2 text-xs text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none w-full [color-scheme:dark]"
                  />
                </div>

                {(dateRange.start || dateRange.end) && (
                  <button
                    type="button"
                    onClick={() => setDateRange({ start: '', end: '' })}
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors flex-shrink-0"
                    title="Limpar filtros"
                  >
                    <X size={14} />
                  </button>
                )}
                
                <div className="w-px h-6 bg-zinc-800 mx-1 hidden sm:block"></div>

                <button
                  type="button"
                  onClick={handleResetData}
                  className="flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 rounded-lg text-zinc-500 hover:text-primary-400 hover:bg-primary-500/5 transition-colors text-xs font-medium whitespace-nowrap"
                  title="Restaurar dados de exemplo para teste"
                >
                  <RotateCcw size={14} />
                  <span className="hidden lg:inline">Restaurar Exemplo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Top KPIs - Using Filtered Data */}
          <StatsCards data={filteredRecords} />

          {/* Graphs - Using Filtered Data */}
          <ChartsSection data={filteredRecords} />

          {/* Data Table - Using Filtered Data */}
          <DataTable 
            data={filteredRecords} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onExport={handleExport}
          />
        </div>
      </main>

      {/* Modal */}
      <DataEntryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={editingRecord}
      />
    </div>
  );
}

export default App;