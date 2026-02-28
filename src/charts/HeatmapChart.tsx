import React, { useCallback } from 'react'
import ReactECharts from 'echarts-for-react'

interface SectorData {
    name: string
    value: number
}

interface HeatmapChartProps {
    data: SectorData[]
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ data }) => {
    const getOption = useCallback(() => {
        const sorted = [...data].sort((a, b) => b.value - a.value)
        const names = sorted.map(d => d.name)
        const values = sorted.map(d => d.value)

        return {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                backgroundColor: '#161b22',
                borderColor: '#21262d',
                textStyle: { color: '#c9d1d9', fontSize: 12, fontFamily: 'JetBrains Mono' },
                formatter: (params: any) => {
                    const val = params.value as number
                    const color = val >= 0 ? '#00d4aa' : '#ff4757'
                    const sign = val >= 0 ? '+' : ''
                    return `<div>
            <span style="font-weight:600">${params.name}</span><br/>
            <span style="color:${color}">${sign}${val.toFixed(2)}%</span>
          </div>`
                },
            },
            grid: { left: 100, right: 16, top: 12, bottom: 12 },
            xAxis: {
                type: 'value',
                min: Math.min(...values) - 0.3,
                max: Math.max(...values) + 0.3,
                axisLabel: {
                    color: '#484f58',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    formatter: (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`,
                },
                axisLine: { lineStyle: { color: '#21262d' } },
                splitLine: { lineStyle: { color: '#161b22', type: 'dashed' } },
                axisTick: { show: false },
            },
            yAxis: {
                type: 'category',
                data: names,
                axisLabel: { color: '#8b949e', fontSize: 11 },
                axisLine: { show: false },
                axisTick: { show: false },
            },
            series: [
                {
                    type: 'bar',
                    data: values.map(v => ({
                        value: v,
                        itemStyle: {
                            color: v >= 0
                                ? `rgba(0, 212, 170, ${Math.min(0.3 + Math.abs(v) * 0.15, 0.9)})`
                                : `rgba(255, 71, 87, ${Math.min(0.3 + Math.abs(v) * 0.15, 0.9)})`,
                            borderRadius: [0, 4, 4, 0],
                        },
                    })),
                    label: {
                        show: true,
                        position: 'right',
                        fontFamily: 'JetBrains Mono',
                        fontSize: 10,
                        color: '#8b949e',
                        formatter: (params: any) => {
                            const v = params.value as number
                            return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
                        },
                    },
                    barMaxWidth: 20,
                    markLine: {
                        symbol: 'none',
                        data: [{ xAxis: 0 }],
                        lineStyle: { color: '#484f58', type: 'solid', width: 1 },
                        label: { show: false },
                    },
                },
            ],
        }
    }, [data])

    return (
        <ReactECharts
            option={getOption()}
            style={{ height: '100%', width: '100%' }}
            notMerge={false}
            lazyUpdate={true}
        />
    )
}

export default HeatmapChart
