import React, { useState } from 'react'
import { Table, Tag, Button, Input } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { ArrowUpOutlined, ArrowDownOutlined, SearchOutlined } from '@ant-design/icons'
import { StockSummary } from '@/data/dummyStockGenerator'
import { StockDetailDialog } from '@/components/panels/StockDetailDialog'
import { cn } from '@/lib/utils'

interface StockTableProps {
    data: StockSummary[]
    selectedSymbol: string
    onSelectStock: (symbol: string) => void
}

export const StockTable: React.FC<StockTableProps> = ({ data, selectedSymbol, onSelectStock }) => {
    const [detailStock, setDetailStock] = useState<StockSummary | null>(null)
    const [searchText, setSearchText] = useState('')

    const filtered = data.filter(s =>
        s.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
        s.name.toLowerCase().includes(searchText.toLowerCase()) ||
        s.sector.toLowerCase().includes(searchText.toLowerCase())
    )

    const columns: ColumnsType<StockSummary> = [
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            width: 120,
            sorter: (a, b) => a.symbol.localeCompare(b.symbol),
            render: (val: string, record) => (
                <div
                    className={cn(
                        'flex flex-col cursor-pointer group',
                        val === selectedSymbol && 'text-primary'
                    )}
                    onClick={() => onSelectStock(val)}
                >
                    <span className={cn(
                        'font-semibold mono text-xs transition-colors',
                        val === selectedSymbol ? 'text-primary' : 'text-foreground group-hover:text-primary'
                    )}>
                        {val}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                        {record.sector}
                    </span>
                </div>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 100,
            align: 'right',
            sorter: (a, b) => a.price - b.price,
            render: (val: number) => (
                <span className="mono text-xs text-foreground">₹{val.toFixed(2)}</span>
            ),
        },
        {
            title: 'Change %',
            dataIndex: 'changePct',
            key: 'changePct',
            width: 100,
            align: 'right',
            sorter: (a, b) => a.changePct - b.changePct,
            defaultSortOrder: 'descend',
            render: (val: number) => (
                <span className={cn('mono text-xs flex items-center justify-end gap-1', val >= 0 ? 'price-up' : 'price-down')}>
                    {val >= 0 ? <ArrowUpOutlined style={{ fontSize: 9 }} /> : <ArrowDownOutlined style={{ fontSize: 9 }} />}
                    {Math.abs(val).toFixed(2)}%
                </span>
            ),
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            width: 90,
            align: 'right',
            sorter: (a, b) => a.volume - b.volume,
            render: (val: number) => (
                <span className="mono text-xs text-muted-foreground">{(val / 1000000).toFixed(2)}M</span>
            ),
        },
        {
            title: 'RSI',
            dataIndex: 'rsi',
            key: 'rsi',
            width: 70,
            align: 'right',
            sorter: (a, b) => a.rsi - b.rsi,
            render: (val: number) => (
                <span className={cn(
                    'mono text-xs',
                    val < 35 ? 'price-up' : val > 65 ? 'price-down' : 'text-yellow-400'
                )}>
                    {val.toFixed(1)}
                </span>
            ),
        },
        {
            title: 'Signal',
            dataIndex: 'signal',
            key: 'signal',
            width: 70,
            align: 'center',
            filters: [
                { text: 'BUY', value: 'BUY' },
                { text: 'SELL', value: 'SELL' },
                { text: 'HOLD', value: 'HOLD' },
            ],
            onFilter: (value, record) => record.signal === value,
            render: (val: string) => (
                <Tag
                    className={cn(
                        'text-[10px] font-semibold rounded-full border-0 px-2',
                        val === 'BUY' ? 'signal-buy' : val === 'SELL' ? 'signal-sell' : 'signal-hold'
                    )}
                >
                    {val}
                </Tag>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 50,
            render: (_, record) => (
                <Button
                    size="small"
                    type="text"
                    onClick={() => setDetailStock(record)}
                    style={{ color: '#484f58', fontSize: 10, padding: '0 4px' }}
                >
                    Detail
                </Button>
            ),
        },
    ]

    const rowProps: TableProps<StockSummary>['onRow'] = (record) => ({
        onClick: () => onSelectStock(record.symbol),
        style: {
            cursor: 'pointer',
            background: record.symbol === selectedSymbol ? 'rgba(0,212,170,0.05)' : undefined,
        },
    })

    return (
        <div className="flex flex-col h-full">
            <div className="px-3 py-2 border-b border-border">
                <Input
                    placeholder="Search symbol, name, sector..."
                    prefix={<SearchOutlined style={{ color: '#484f58' }} />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    size="small"
                    allowClear
                    style={{ background: '#0d1117', borderColor: '#21262d', color: '#c9d1d9' }}
                />
            </div>
            <div className="flex-1 overflow-auto">
                <Table<StockSummary>
                    columns={columns}
                    dataSource={filtered}
                    rowKey="symbol"
                    size="small"
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total) => (
                            <span style={{ color: '#484f58', fontSize: 11 }}>{total} stocks</span>
                        ),
                    }}
                    onRow={rowProps}
                    scroll={{ x: 'max-content' }}
                />
            </div>
            {detailStock && (
                <StockDetailDialog
                    stock={detailStock}
                    open={!!detailStock}
                    onClose={() => setDetailStock(null)}
                />
            )}
        </div>
    )
}

export default StockTable
