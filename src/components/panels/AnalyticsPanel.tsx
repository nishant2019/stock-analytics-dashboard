import React from 'react'
import { TrendingUp, TrendingDown, BarChart2, Activity, DollarSign, Percent } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StockSummary } from '@/data/dummyStockGenerator'
import { OHLCData } from '@/data/dummyStockGenerator'
import { cn } from '@/lib/utils'

interface AnalyticsPanelProps {
    selectedStock: StockSummary | undefined
    chartData: OHLCData[]
}

interface StatCardProps {
    title: string
    value: string
    subtitle?: string
    icon: React.ReactNode
    trend?: 'up' | 'down' | 'neutral'
    className?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, className }) => (
    <Card className={cn('stat-card border-0', className)}>
        <CardHeader className="p-3 pb-1">
            <CardTitle className="flex items-center justify-between text-xs">
                <span>{title}</span>
                <span className={cn(
                    'p-1.5 rounded-md',
                    trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' :
                        trend === 'down' ? 'bg-red-500/10 text-red-400' :
                            'bg-accent text-muted-foreground'
                )}>
                    {icon}
                </span>
            </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
            <div className={cn(
                'text-xl font-bold mono',
                trend === 'up' ? 'price-up' : trend === 'down' ? 'price-down' : 'text-foreground'
            )}>
                {value}
            </div>
            {subtitle && <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>}
        </CardContent>
    </Card>
)

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ selectedStock, chartData }) => {
    if (!selectedStock) return null

    const last = chartData[chartData.length - 1]
    const first = chartData[0]
    const weekData = chartData.slice(-5)
    const weekHigh = Math.max(...weekData.map(d => d.high))
    const weekLow = Math.min(...weekData.map(d => d.low))
    const allTimeHigh = Math.max(...chartData.map(d => d.high))
    const allTimeLow = Math.min(...chartData.map(d => d.low))
    const totalReturn = first ? ((last?.close - first.open) / first.open) * 100 : 0
    const avgVolume = chartData.length
        ? chartData.reduce((sum, d) => sum + d.volume, 0) / chartData.length
        : 0

    const changeTrend = selectedStock.changePct >= 0 ? 'up' : 'down'

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            <StatCard
                title="Current Price"
                value={`₹${selectedStock.price.toFixed(2)}`}
                subtitle={`${selectedStock.changePct >= 0 ? '+' : ''}${selectedStock.changePct.toFixed(2)}% today`}
                icon={<DollarSign size={12} />}
                trend={changeTrend}
            />
            <StatCard
                title="Day Change"
                value={`${selectedStock.change >= 0 ? '+' : ''}₹${selectedStock.change.toFixed(2)}`}
                subtitle="vs previous close"
                icon={selectedStock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                trend={changeTrend}
            />
            <StatCard
                title="Volume"
                value={`${(selectedStock.volume / 1000000).toFixed(2)}M`}
                subtitle={`Avg: ${(avgVolume / 1000000).toFixed(2)}M`}
                icon={<BarChart2 size={12} />}
                trend="neutral"
            />
            <StatCard
                title="RSI (14)"
                value={selectedStock.rsi.toFixed(1)}
                subtitle={selectedStock.rsi < 35 ? 'Oversold' : selectedStock.rsi > 65 ? 'Overbought' : 'Neutral'}
                icon={<Activity size={12} />}
                trend={selectedStock.rsi < 35 ? 'up' : selectedStock.rsi > 65 ? 'down' : 'neutral'}
            />
            <StatCard
                title="52W Range"
                value={`${allTimeLow.toFixed(0)} - ${allTimeHigh.toFixed(0)}`}
                subtitle="Low — High"
                icon={<Percent size={12} />}
                trend="neutral"
            />
            <StatCard
                title="Total Return"
                value={`${totalReturn >= 0 ? '+' : ''}${totalReturn.toFixed(2)}%`}
                subtitle={`${chartData.length} candles`}
                icon={<TrendingUp size={12} />}
                trend={totalReturn >= 0 ? 'up' : 'down'}
            />
            {last && (
                <>
                    <StatCard
                        title="Day High"
                        value={`₹${last.high.toFixed(2)}`}
                        subtitle="Intraday high"
                        icon={<TrendingUp size={12} />}
                        trend="up"
                    />
                    <StatCard
                        title="Day Low"
                        value={`₹${last.low.toFixed(2)}`}
                        subtitle="Intraday low"
                        icon={<TrendingDown size={12} />}
                        trend="down"
                    />
                    <StatCard
                        title="Week Range"
                        value={`${weekLow.toFixed(0)} - ${weekHigh.toFixed(0)}`}
                        subtitle="5-day range"
                        icon={<BarChart2 size={12} />}
                        trend="neutral"
                    />
                </>
            )}
        </div>
    )
}

export default AnalyticsPanel
