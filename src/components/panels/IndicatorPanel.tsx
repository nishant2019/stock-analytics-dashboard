import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface IndicatorRowProps {
    name: string
    value: string
    signal: 'BUY' | 'SELL' | 'HOLD'
    description: string
}

const IndicatorRow: React.FC<IndicatorRowProps> = ({ name, value, signal, description }) => (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
        <div>
            <div className="text-xs font-medium text-foreground">{name}</div>
            <div className="text-[11px] text-muted-foreground">{description}</div>
        </div>
        <div className="flex items-center gap-3">
            <span className="mono text-xs text-foreground">{value}</span>
            <span className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                signal === 'BUY' ? 'signal-buy' : signal === 'SELL' ? 'signal-sell' : 'signal-hold'
            )}>
                {signal}
            </span>
        </div>
    </div>
)

interface IndicatorPanelProps {
    rsi: number
    price: number
    changePct: number
}

export const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ rsi, price, changePct }) => {
    // Derive mock indicator values
    const macdValue = parseFloat((changePct * 2.3).toFixed(2))
    const stochRsi = parseFloat(((rsi / 100) * 0.8 + Math.random() * 0.2).toFixed(3))
    const cci = parseFloat(((rsi - 50) * 3.2).toFixed(1))
    const willR = parseFloat((-(100 - rsi) * 0.95).toFixed(1))
    const mfi = parseFloat((rsi * 0.9 + Math.random() * 10).toFixed(1))
    const atr = parseFloat((price * 0.015 + Math.random() * price * 0.005).toFixed(2))

    const getSignal = (val: number, low: number, high: number): 'BUY' | 'SELL' | 'HOLD' =>
        val < low ? 'BUY' : val > high ? 'SELL' : 'HOLD'

    return (
        <Card className="border-border bg-card">
            <CardHeader className="p-3 pb-2">
                <CardTitle className="text-xs">Technical Indicators</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <IndicatorRow
                    name="RSI (14)"
                    value={rsi.toFixed(2)}
                    signal={getSignal(rsi, 35, 65)}
                    description="Relative Strength Index"
                />
                <IndicatorRow
                    name="MACD"
                    value={`${macdValue > 0 ? '+' : ''}${macdValue}`}
                    signal={getSignal(macdValue, -2, 2)}
                    description="Moving Avg Convergence"
                />
                <IndicatorRow
                    name="Stoch RSI"
                    value={stochRsi.toFixed(3)}
                    signal={getSignal(stochRsi, 0.2, 0.8)}
                    description="Stochastic RSI"
                />
                <IndicatorRow
                    name="CCI (20)"
                    value={cci.toFixed(1)}
                    signal={getSignal(cci, -100, 100)}
                    description="Commodity Channel Index"
                />
                <IndicatorRow
                    name="Williams %R"
                    value={`${willR.toFixed(1)}%`}
                    signal={getSignal(willR, -80, -20)}
                    description="Williams Percent Range"
                />
                <IndicatorRow
                    name="MFI (14)"
                    value={mfi.toFixed(1)}
                    signal={getSignal(mfi, 25, 75)}
                    description="Money Flow Index"
                />
                <IndicatorRow
                    name="ATR (14)"
                    value={`₹${atr.toFixed(2)}`}
                    signal="HOLD"
                    description="Average True Range"
                />
            </CardContent>
        </Card>
    )
}

export default IndicatorPanel
