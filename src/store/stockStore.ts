import { create } from 'zustand';
import {
    OHLCData,
    StockSummary,
    generateOHLC,
    generateAllStockSummaries,
    generateSectorHeatmapData,
    NIFTY50_STOCKS,
} from '@/data/dummyStockGenerator';

interface SectorData {
    name: string;
    value: number;
}

interface StockStore {
    // State
    selectedSymbol: string;
    chartData: OHLCData[];
    stockSummaries: StockSummary[];
    sectorData: SectorData[];
    isDarkMode: boolean;
    searchQuery: string;
    isLoading: boolean;

    // Actions
    setSelectedSymbol: (symbol: string) => void;
    toggleDarkMode: () => void;
    setSearchQuery: (query: string) => void;
    refreshData: () => void;
    initializeData: () => void;
}

export const useStockStore = create<StockStore>((set, get) => ({
    selectedSymbol: NIFTY50_STOCKS[0].symbol,
    chartData: [],
    stockSummaries: [],
    sectorData: [],
    isDarkMode: true,
    searchQuery: '',
    isLoading: false,

    setSelectedSymbol: (symbol: string) => {
        set({ isLoading: true, selectedSymbol: symbol });
        // Simulate async update
        setTimeout(() => {
            const chartData = generateOHLC(symbol, 200);
            set({ chartData, isLoading: false });
        }, 150);
    },

    toggleDarkMode: () => {
        const isDarkMode = !get().isDarkMode;
        set({ isDarkMode });
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    setSearchQuery: (query: string) => {
        set({ searchQuery: query });
    },

    refreshData: () => {
        const { selectedSymbol } = get();
        set({ isLoading: true });
        setTimeout(() => {
            const chartData = generateOHLC(selectedSymbol, 200);
            const stockSummaries = generateAllStockSummaries();
            const sectorData = generateSectorHeatmapData();
            set({ chartData, stockSummaries, sectorData, isLoading: false });
        }, 300);
    },

    initializeData: () => {
        const symbol = NIFTY50_STOCKS[0].symbol;
        const chartData = generateOHLC(symbol, 200);
        const stockSummaries = generateAllStockSummaries();
        const sectorData = generateSectorHeatmapData();
        set({
            selectedSymbol: symbol,
            chartData,
            stockSummaries,
            sectorData,
        });
    },
}));
