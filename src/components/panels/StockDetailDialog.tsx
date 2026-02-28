import React from 'react'
import { TrendingUp, TrendingDown, BarChart2, Activity, Building2, Info } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { StockSummary } from '@/data/dummyStockGenerator'

interface StockDetailDialogProps {
    stock: StockSummary
    open: boolean
    onClose: () => void
}

interface InfoRowProps {
    label: string
    value: string
    valueClass?: string
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, valueClass }) => (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={cn('text-xs font-medium mono', valueClass ?? 'text-foreground')}>{value}</span>
    </div>
)

export const StockDetailDialog: React.FC<StockDetailDialogProps> = ({ stock, open, onClose }) => {
    const isBullish = stock.changePct >= 0

    // Mock extra values
    const marketCap = (stock.price * (Math.random() * 500 + 100)).toFixed(0)
    const pe = (Math.random() * 40 + 10).toFixed(1)
    const pb = (Math.random() * 8 + 1).toFixed(2)
    const eps = (stock.price / parseFloat(pe)).toFixed(2)
    const dividendYield = (Math.random() * 2).toFixed(2)
    const beta = (Math.random() * 1.5 + 0.3).toFixed(2)

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building2 size={18} className="text-primary" />
                            </div>
                            <div>
                                <div className="text-lg font-bold mono text-foreground">{stock.symbol}</div>
                                <div className="text-xs text-muted-foreground font-normal">{stock.name}</div>
                            </div>
                            <div className="ml-auto text-right">
                                <div className="text-xl font-bold mono text-foreground">₹{stock.price.toFixed(2)}</div>
                                <div className={cn('text-sm mono flex items-center gap-1', isBullish ? 'price-up' : 'price-down')}>
                                    {isBullish ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">
                            <Info size={11} className="mr-1.5" />Overview
                        </TabsTrigger>
                        <TabsTrigger value="indicators">
                            <Activity size={11} className="mr-1.5" />Indicators
                        </TabsTrigger>
                        <TabsTrigger value="signals">
                            <BarChart2 size={11} className="mr-1.5" />Signals
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-2 gap-6 mt-2">
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Fundamentals</div>
                                <InfoRow label="Sector" value={stock.sector} />
                                <InfoRow label="Market Cap" value={`₹${(parseFloat(marketCap) / 100).toFixed(2)}B`} />
                                <InfoRow label="P/E Ratio" value={pe} />
                                <InfoRow label="P/B Ratio" value={pb} />
                                <InfoRow label="EPS" value={`₹${eps}`} />
                                <InfoRow label="Dividend Yield" value={`${dividendYield}%`} />
                                <InfoRow label="Beta" value={beta} />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Price Stats</div>
                                <InfoRow label="Open" value={`₹${(stock.price - stock.change).toFixed(2)}`} />
                                <InfoRow
                                    label="Change"
                                    value={`${stock.change >= 0 ? '+' : ''}₹${stock.change.toFixed(2)}`}
                                    valueClass={isBullish ? 'price-up' : 'price-down'}
                                />
                                <InfoRow label="Volume" value={`${(stock.volume / 1e6).toFixed(2)}M`} />
                                <InfoRow label="RSI" value={stock.rsi.toFixed(2)} />
                                <InfoRow
                                    label="Signal"
                                    value={stock.signal}
                                    valueClass={stock.signal === 'BUY' ? 'text-emerald-400' : stock.signal === 'SELL' ? 'text-red-400' : 'text-yellow-400'}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="indicators">
                        <div className="space-y-2 mt-2">
                            {[
                                { name: 'RSI (14)', val: stock.rsi, low: 35, high: 65, unit: '' },
                                { name: 'MACD', val: stock.changePct * 2.1, low: -2, high: 2, unit: '' },
                                { name: 'Stoch RSI', val: stock.rsi / 100, low: 0.2, high: 0.8, unit: '' },
                                { name: 'CCI (20)', val: (stock.rsi - 50) * 3, low: -100, high: 100, unit: '' },
                                { name: 'MFI (14)', val: stock.rsi * 0.9, low: 25, high: 75, unit: '' },
                            ].map(({ name, val, low, high, unit }) => {
                                const signal = val < low ? 'BUY' : val > high ? 'SELL' : 'HOLD'
                                const pct = Math.min(100, Math.max(0, ((val - low) / (high - low)) * 100))
                                return (
                                    <div key={name} className="flex items-center gap-3 py-1.5">
                                        <div className="w-24 text-xs text-muted-foreground shrink-0">{name}</div>
                                        <div className="flex-1 h-1.5 bg-accent rounded-full overflow-hidden">
                                            <div
                                                className={cn('h-full rounded-full transition-all', signal === 'BUY' ? 'bg-emerald-400' : signal === 'SELL' ? 'bg-red-400' : 'bg-yellow-400')}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="w-16 text-right text-xs mono text-foreground">{val.toFixed(2)}{unit}</span>
                                        <span className={cn(
                                            'text-[10px] font-semibold px-1.5 py-0.5 rounded-full w-10 text-center',
                                            signal === 'BUY' ? 'signal-buy' : signal === 'SELL' ? 'signal-sell' : 'signal-hold'
                                        )}>
                                            {signal}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </TabsContent>

                    <TabsContent value="signals">
                        <div className="mt-2 space-y-3">
                            <div className={cn(
                                'p-4 rounded-lg border',
                                stock.signal === 'BUY' ? 'bg-emerald-500/5 border-emerald-500/20' :
                                    stock.signal === 'SELL' ? 'bg-red-500/5 border-red-500/20' :
                                        'bg-yellow-500/5 border-yellow-500/20'
                            )}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={cn(
                                        'text-lg font-bold mono',
                                        stock.signal === 'BUY' ? 'text-emerald-400' :
                                            stock.signal === 'SELL' ? 'text-red-400' :
                                                'text-yellow-400'
                                    )}>
                                        {stock.signal}
                                    </span>
                                    <span className="text-xs text-muted-foreground">Overall Signal</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {stock.signal === 'BUY'
                                        ? `${stock.symbol} is showing oversold conditions (RSI: ${stock.rsi.toFixed(1)}). Multiple indicators suggest a potential reversal. Consider accumulating at current levels.`
                                        : stock.signal === 'SELL'
                                            ? `${stock.symbol} appears overbought (RSI: ${stock.rsi.toFixed(1)}). Momentum indicators suggest distribution phase. Consider booking profits.`
                                            : `${stock.symbol} is in consolidation. RSI at ${stock.rsi.toFixed(1)} suggests neutral momentum. Wait for a clear directional breakout.`
                                    }
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {['Short Term', 'Medium Term', 'Long Term'].map((term, i) => {
                                    const signals = ['BUY', 'HOLD', 'SELL'] as const
                                    const idx = (stock.rsi < 40 ? 0 : stock.rsi > 60 ? 2 : 1)
                                    const adjusted = signals[(idx + i) % 3]
                                    return (
                                        <div key={term} className="text-center p-2 rounded-lg bg-accent">
                                            <div className="text-[10px] text-muted-foreground mb-1">{term}</div>
                                            <div className={cn(
                                                'text-sm font-bold mono',
                                                adjusted === 'BUY' ? 'text-emerald-400' : adjusted === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                                            )}>
                                                {adjusted}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default StockDetailDialog
