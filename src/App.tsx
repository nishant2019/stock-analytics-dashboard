import React from 'react'
import { ConfigProvider, theme } from 'antd'
import { DashboardLayout } from '@/layout/DashboardLayout'
import { Dashboard } from '@/pages/Dashboard'

const antdDarkTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: '#00d4aa',
        colorBgBase: '#0d1117',
        colorBgContainer: '#161b22',
        colorBgElevated: '#1c2128',
        colorBorder: '#21262d',
        colorBorderSecondary: '#161b22',
        colorText: '#c9d1d9',
        colorTextSecondary: '#8b949e',
        colorTextTertiary: '#484f58',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 13,
        borderRadius: 6,
        colorSuccess: '#00d4aa',
        colorError: '#ff4757',
        colorWarning: '#eab308',
        colorInfo: '#3b82f6',
        controlHeight: 32,
        lineHeight: 1.5,
    },
    components: {
        Table: {
            colorBgContainer: 'transparent',
            headerBg: '#161b22',
            rowHoverBg: 'rgba(0,212,170,0.04)',
            borderColor: '#1c2128',
        },
        Input: {
            colorBgContainer: '#0d1117',
            colorBorder: '#21262d',
            activeBorderColor: '#00d4aa',
            hoverBorderColor: '#30363d',
        },
        Menu: {
            colorBgContainer: 'transparent',
            itemBg: 'transparent',
            itemColor: '#8b949e',
            itemHoverBg: 'rgba(0,212,170,0.06)',
            itemHoverColor: '#c9d1d9',
            itemSelectedBg: 'rgba(0,212,170,0.12)',
            itemSelectedColor: '#00d4aa',
        },
        Layout: {
            siderBg: '#0d1117',
            headerBg: '#161b22',
            bodyBg: '#0b0f14',
        },
    },
}

const App: React.FC = () => {
    return (
        <ConfigProvider theme={antdDarkTheme}>
            <DashboardLayout>
                <Dashboard />
            </DashboardLayout>
        </ConfigProvider>
    )
}

export default App
