import React, { useEffect } from 'react'
import { useStockStore } from '@/store/stockStore'
import { CandlestickChart } from '@/charts/CandlestickChart'
import { HeatmapChart } from '@/charts/HeatmapChart'
import { AnalyticsPanel } from '@/components/panels/AnalyticsPanel'
import { IndicatorPanel } from '@/components/panels/IndicatorPanel'
import { StockTable } from '@/components/tables/StockTable'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export const Dashboard: React.FC = () => {
    const {
        selectedSymbol,
        chartData,
        stockSummaries,
        sectorData,
        isLoading,
        initializeData,
        setSelectedSymbol,
    } = useStockStore()

    useEffect(() => {
        initializeData()
    }, [initializeData])

    const selectedSummary = stockSummaries.find(s => s.symbol === selectedSymbol)

    return (
        <div className="flex flex-col gap-3 h-full">
            {/* Row 1: Chart + Side panels */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-3" style={{ minHeight: 420 }}>
                {/* Chart area */}
                <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
                    {/* Chart header */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="font-bold mono text-sm text-foreground">{selectedSymbol}</span>
                            <span className="text-xs text-muted-foreground">Daily · OHLC</span>
                            <div className="flex items-center gap-2 text-[11px]">
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-0.5 bg-yellow-400 inline-block rounded" />
                                    <span className="text-muted-foreground">MA20</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-0.5 bg-violet-400 inline-block rounded" style={{ borderStyle: 'dashed' }} />
                                    <span className="text-muted-foreground">MA50</span>
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                'text-[10px] px-2 py-0.5 rounded-full font-medium border',
                                isLoading ? 'border-muted text-muted-foreground' : 'border-primary/30 text-primary bg-primary/10'
                            )}>
                                {isLoading ? 'Loading...' : 'LIVE DATA'}
                            </span>
                        </div>
                    </div>
                    {/* Chart */}
                    <div className="flex-1 min-h-0 p-1">
                        <CandlestickChart
                            data={chartData}
                            symbol={selectedSymbol}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Right side panel */}
                <div className="flex flex-col gap-3">
                    {/* Tabs panel */}
                    <div className="glass-panel rounded-xl flex-1 overflow-hidden flex flex-col">
                        <Tabs defaultValue="overview" className="flex flex-col h-full">
                            <div className="px-3 pt-3 shrink-0">
                                <TabsList className="w-full">
                                    <TabsTrigger value="overview" className="flex-1 text-[11px]">Overview</TabsTrigger>
                                    <TabsTrigger value="indicators" className="flex-1 text-[11px]">Indicators</TabsTrigger>
                                    <TabsTrigger value="heatmap" className="flex-1 text-[11px]">Heatmap</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="overview" className="flex-1 overflow-auto px-3 pb-3">
                                {selectedSummary ? (
                                    <AnalyticsPanel selectedStock={selectedSummary} chartData={chartData} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                                        Select a stock to view analytics
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="indicators" className="flex-1 overflow-auto px-3 pb-3">
                                {selectedSummary ? (
                                    <IndicatorPanel
                                        rsi={selectedSummary.rsi}
                                        price={selectedSummary.price}
                                        changePct={selectedSummary.changePct}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                                        Select a stock to view indicators
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="heatmap" className="flex-1 overflow-hidden px-2 pb-2">
                                <div className="h-full min-h-[320px]">
                                    <HeatmapChart data={sectorData} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Row 2: Stock Table */}
            <div className="glass-panel rounded-xl overflow-hidden flex flex-col" style={{ minHeight: 300 }}>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Market Overview
                        </span>
                        <span className="text-[10px] text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                            {stockSummaries.length} stocks
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                            {stockSummaries.filter(s => s.signal === 'BUY').length} Buy
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                            {stockSummaries.filter(s => s.signal === 'SELL').length} Sell
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                            {stockSummaries.filter(s => s.signal === 'HOLD').length} Hold
                        </span>
                    </div>
                </div>
                <div className="flex-1 min-h-0">
                    <StockTable
                        data={stockSummaries}
                        selectedSymbol={selectedSymbol}
                        onSelectStock={setSelectedSymbol}
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
