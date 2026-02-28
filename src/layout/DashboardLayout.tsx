import React, { useState } from 'react'
import { Layout, Menu, Input, Badge, Tooltip } from 'antd'
import {
    BarChartOutlined,
    SearchOutlined,
    ReloadOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BulbOutlined,
    BulbFilled,
    ThunderboltOutlined,
    RiseOutlined,
    FallOutlined,
} from '@ant-design/icons'
import { useStockStore } from '@/store/stockStore'
import { NIFTY50_STOCKS } from '@/data/dummyStockGenerator'
import { cn } from '@/lib/utils'

const { Header, Sider, Content } = Layout

interface DashboardLayoutProps {
    children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const {
        selectedSymbol,
        setSelectedSymbol,
        stockSummaries,
        isDarkMode,
        toggleDarkMode,
        searchQuery,
        setSearchQuery,
        refreshData,
        isLoading,
    } = useStockStore()

    const [collapsed, setCollapsed] = useState(false)

    const filteredStocks = NIFTY50_STOCKS.filter(s =>
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const selectedSummary = stockSummaries.find(s => s.symbol === selectedSymbol)

    const menuItems = filteredStocks.map(stock => {
        const summary = stockSummaries.find(s => s.symbol === stock.symbol)
        const isSelected = stock.symbol === selectedSymbol
        const isUp = (summary?.changePct ?? 0) >= 0

        return {
            key: stock.symbol,
            style: {
                height: 52,
                lineHeight: '52px',
                padding: '0 12px',
                margin: '1px 4px',
                borderRadius: 6,
                background: isSelected ? 'rgba(0,212,170,0.12)' : 'transparent',
                borderLeft: isSelected ? '2px solid #00d4aa' : '2px solid transparent',
            },
            label: (
                <div className="flex items-center justify-between w-full" onClick={() => setSelectedSymbol(stock.symbol)}>
                    <div className="flex flex-col">
                        <span className={cn(
                            'text-xs font-semibold mono leading-tight',
                            isSelected ? 'text-primary' : 'text-foreground'
                        )}>
                            {stock.symbol}
                        </span>
                        {!collapsed && (
                            <span className="text-[10px] text-muted-foreground leading-tight truncate max-w-[100px]">
                                {stock.name}
                            </span>
                        )}
                    </div>
                    {!collapsed && summary && (
                        <div className={cn('text-[10px] mono flex items-center gap-0.5', isUp ? 'price-up' : 'price-down')}>
                            {isUp ? <RiseOutlined style={{ fontSize: 9 }} /> : <FallOutlined style={{ fontSize: 9 }} />}
                            {Math.abs(summary.changePct).toFixed(2)}%
                        </div>
                    )}
                </div>
            ),
        }
    })

    return (
        <Layout style={{ height: '100vh', overflow: 'hidden', background: '#0b0f14' }}>
            {/* Sidebar */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={200}
                collapsedWidth={56}
                style={{
                    background: '#0d1117',
                    borderRight: '1px solid #21262d',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                trigger={null}
            >
                {/* Logo */}
                <div className="flex items-center gap-2 px-3 py-3 border-b border-border">
                    <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center shrink-0">
                        <ThunderboltOutlined style={{ color: '#0d1117', fontSize: 14, fontWeight: 700 }} />
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="text-xs font-bold text-foreground mono">StockVision</div>
                            <div className="text-[9px] text-muted-foreground">Pro Analytics</div>
                        </div>
                    )}
                </div>

                {/* Sidebar search */}
                {!collapsed && (
                    <div className="px-2 py-2 border-b border-border">
                        <Input
                            placeholder="Filter stocks..."
                            prefix={<SearchOutlined style={{ color: '#484f58', fontSize: 11 }} />}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            size="small"
                            allowClear
                            style={{ background: '#0d1117', borderColor: '#21262d', color: '#c9d1d9', fontSize: 11 }}
                        />
                    </div>
                )}

                {/* Stock list */}
                <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedSymbol]}
                        items={menuItems}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '4px 0',
                        }}
                    />
                </div>

                {/* Collapse button */}
                <div
                    className="flex items-center justify-center py-2 border-t border-border cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed
                        ? <MenuUnfoldOutlined style={{ color: '#484f58' }} />
                        : <MenuFoldOutlined style={{ color: '#484f58' }} />
                    }
                </div>
            </Sider>

            <Layout style={{ background: 'transparent' }}>
                {/* Header */}
                <Header
                    style={{
                        padding: '0 16px',
                        background: '#161b22',
                        borderBottom: '1px solid #21262d',
                        height: 48,
                        lineHeight: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    {/* Left: Symbol badge */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <BarChartOutlined style={{ color: '#00d4aa', fontSize: 16 }} />
                            <span className="mono text-sm font-bold text-foreground">{selectedSymbol}</span>
                            {selectedSummary && (
                                <>
                                    <span className="mono text-sm text-foreground">₹{selectedSummary.price.toFixed(2)}</span>
                                    <span className={cn('mono text-xs', selectedSummary.changePct >= 0 ? 'price-up' : 'price-down')}>
                                        {selectedSummary.changePct >= 0 ? '+' : ''}{selectedSummary.changePct.toFixed(2)}%
                                    </span>
                                    <Badge
                                        count={selectedSummary.signal}
                                        style={{
                                            backgroundColor: selectedSummary.signal === 'BUY' ? 'rgba(0,212,170,0.15)' :
                                                selectedSummary.signal === 'SELL' ? 'rgba(255,71,87,0.15)' : 'rgba(234,179,8,0.15)',
                                            color: selectedSummary.signal === 'BUY' ? '#00d4aa' :
                                                selectedSummary.signal === 'SELL' ? '#ff4757' : '#eab308',
                                            border: `1px solid ${selectedSummary.signal === 'BUY' ? 'rgba(0,212,170,0.3)' :
                                                selectedSummary.signal === 'SELL' ? 'rgba(255,71,87,0.3)' : 'rgba(234,179,8,0.3)'}`,
                                            fontSize: 9,
                                            fontWeight: 600,
                                            padding: '0 6px',
                                            borderRadius: 20,
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Center: Market status */}
                    <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
                        {stockSummaries.slice(0, 4).map(s => (
                            <div key={s.symbol} className="flex items-center gap-1.5 text-xs">
                                <span className="text-muted-foreground mono">{s.symbol}</span>
                                <span className={cn('mono', s.changePct >= 0 ? 'price-up' : 'price-down')}>
                                    {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(2)}%
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 ml-auto">
                        <Tooltip title="Refresh data">
                            <button
                                onClick={refreshData}
                                disabled={isLoading}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent hover:bg-accent/80 transition-colors disabled:opacity-50"
                            >
                                <ReloadOutlined
                                    style={{ color: '#8b949e', fontSize: 13 }}
                                    spin={isLoading}
                                />
                            </button>
                        </Tooltip>
                        <Tooltip title={isDarkMode ? 'Light mode' : 'Dark mode'}>
                            <button
                                onClick={toggleDarkMode}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                            >
                                {isDarkMode
                                    ? <BulbOutlined style={{ color: '#8b949e', fontSize: 13 }} />
                                    : <BulbFilled style={{ color: '#eab308', fontSize: 13 }} />
                                }
                            </button>
                        </Tooltip>
                        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary">SV</span>
                        </div>
                    </div>
                </Header>

                {/* Main content */}
                <Content style={{ overflow: 'auto', background: '#0b0f14', padding: 12 }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

export default DashboardLayout
