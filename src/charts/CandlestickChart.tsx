import React, { useCallback, useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { OHLCData, calculateMA } from '@/data/dummyStockGenerator'

interface CandlestickChartProps {
    data: OHLCData[]
    symbol: string
    isLoading?: boolean
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, symbol, isLoading }) => {
    const ma20 = useMemo(() => calculateMA(data, 20), [data])
    const ma50 = useMemo(() => calculateMA(data, 50), [data])

    const getOption = useCallback(() => {
        const times = data.map(d => d.time)
        const ohlc = data.map(d => [d.open, d.close, d.low, d.high])
        const volumes = data.map(d => ({
            value: d.volume,
            itemStyle: {
                color: d.close >= d.open ? 'rgba(0, 212, 170, 0.5)' : 'rgba(255, 71, 87, 0.5)',
            },
        }))

        return {
            backgroundColor: 'transparent',
            animation: true,
            animationDuration: 600,
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross' },
                backgroundColor: '#161b22',
                borderColor: '#21262d',
                textStyle: { color: '#c9d1d9', fontSize: 12, fontFamily: 'JetBrains Mono' },
                formatter: (params: any[]) => {
                    const ohlcParam = params.find((p: any) => p.seriesName === 'OHLC')
                    if (!ohlcParam) return ''
                    const [, close, low, high] = ohlcParam.data
                    const open = data[ohlcParam.dataIndex]?.open ?? 0
                    const vol = data[ohlcParam.dataIndex]?.volume ?? 0
                    const color = close >= open ? '#00d4aa' : '#ff4757'
                    return `
            <div style="padding:4px 0">
              <div style="font-weight:600;color:#c9d1d9;margin-bottom:6px">${ohlcParam.name}</div>
              <div>O: <span style="color:${color}">${open.toFixed(2)}</span></div>
              <div>H: <span style="color:#00d4aa">${high.toFixed(2)}</span></div>
              <div>L: <span style="color:#ff4757">${low.toFixed(2)}</span></div>
              <div>C: <span style="color:${color}">${close.toFixed(2)}</span></div>
              <div style="margin-top:4px;color:#8b949e">Vol: ${(vol / 1000000).toFixed(2)}M</div>
            </div>
          `
                },
            },
            legend: {
                data: ['OHLC', 'MA 20', 'MA 50'],
                textStyle: { color: '#8b949e', fontSize: 11 },
                top: 8,
                right: 16,
                itemWidth: 20,
                itemHeight: 2,
            },
            grid: [
                { left: 60, right: 16, top: 40, bottom: '32%' },
                { left: 60, right: 16, height: '22%', bottom: 32 },
            ],
            xAxis: [
                {
                    type: 'category',
                    data: times,
                    gridIndex: 0,
                    axisLabel: { show: false },
                    axisLine: { lineStyle: { color: '#21262d' } },
                    splitLine: { lineStyle: { color: '#161b22', type: 'dashed' } },
                },
                {
                    type: 'category',
                    data: times,
                    gridIndex: 1,
                    axisLabel: {
                        color: '#484f58',
                        fontSize: 10,
                        showMaxLabel: true,
                        formatter: (val: string) => val.slice(5),
                    },
                    axisLine: { lineStyle: { color: '#21262d' } },
                    splitLine: { show: false },
                },
            ],
            yAxis: [
                {
                    scale: true,
                    gridIndex: 0,
                    axisLabel: {
                        color: '#8b949e',
                        fontSize: 11,
                        fontFamily: 'JetBrains Mono',
                        formatter: (val: number) => val.toFixed(0),
                    },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { lineStyle: { color: '#161b22', type: 'dashed' } },
                },
                {
                    scale: true,
                    gridIndex: 1,
                    axisLabel: {
                        color: '#484f58',
                        fontSize: 9,
                        fontFamily: 'JetBrains Mono',
                        formatter: (val: number) => `${(val / 1000000).toFixed(1)}M`,
                    },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false },
                },
            ],
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 50,
                    end: 100,
                    zoomLock: false,
                },
                {
                    type: 'slider',
                    xAxisIndex: [0, 1],
                    start: 50,
                    end: 100,
                    height: 20,
                    bottom: 4,
                    handleStyle: { color: '#00d4aa' },
                    fillerColor: 'rgba(0,212,170,0.1)',
                    borderColor: '#21262d',
                    textStyle: { color: '#484f58', fontSize: 10 },
                    dataBackground: {
                        lineStyle: { color: '#21262d' },
                        areaStyle: { color: '#161b22' },
                    },
                },
            ],
            series: [
                {
                    name: 'OHLC',
                    type: 'candlestick',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: ohlc,
                    itemStyle: {
                        color: '#00d4aa',
                        color0: '#ff4757',
                        borderColor: '#00d4aa',
                        borderColor0: '#ff4757',
                        borderWidth: 1.5,
                    },
                },
                {
                    name: 'MA 20',
                    type: 'line',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: ma20,
                    smooth: true,
                    lineStyle: { width: 1.5, color: '#f59e0b' },
                    symbol: 'none',
                    connectNulls: true,
                },
                {
                    name: 'MA 50',
                    type: 'line',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: ma50,
                    smooth: true,
                    lineStyle: { width: 1.5, color: '#a78bfa', type: 'dashed' },
                    symbol: 'none',
                    connectNulls: true,
                },
                {
                    name: 'Volume',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: volumes,
                    barMaxWidth: 6,
                },
            ],
        }
    }, [data, ma20, ma50])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">Loading {symbol}...</p>
                </div>
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No data available
            </div>
        )
    }

    return (
        <ReactECharts
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={false}
            className="w-full h-full"
        />
    )
}

export default CandlestickChart
