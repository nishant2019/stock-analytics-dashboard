export interface OHLCData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface StockInfo {
    symbol: string;
    name: string;
    sector: string;
    basePrice: number;
}

export const NIFTY50_STOCKS: StockInfo[] = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', basePrice: 2850 },
    { symbol: 'TCS', name: 'Tata Consultancy', sector: 'IT', basePrice: 3920 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', basePrice: 1680 },
    { symbol: 'INFY', name: 'Infosys', sector: 'IT', basePrice: 1540 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', basePrice: 1020 },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG', basePrice: 2480 },
    { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', basePrice: 780 },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', basePrice: 1320 },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking', basePrice: 1760 },
    { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', basePrice: 3640 },
    { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Banking', basePrice: 1090 },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'NBFC', basePrice: 6820 },
    { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Consumer', basePrice: 2890 },
    { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Auto', basePrice: 12400 },
    { symbol: 'WIPRO', name: 'Wipro', sector: 'IT', basePrice: 480 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', basePrice: 920 },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Pharma', basePrice: 1580 },
    { symbol: 'TITAN', name: 'Titan Company', sector: 'Consumer', basePrice: 3380 },
    { symbol: 'NESTLEIND', name: 'Nestle India', sector: 'FMCG', basePrice: 24500 },
    { symbol: 'POWERGRID', name: 'Power Grid Corp', sector: 'Power', basePrice: 285 },
];

export const SECTORS = [
    'Energy', 'IT', 'Banking', 'FMCG', 'Telecom',
    'Infrastructure', 'NBFC', 'Consumer', 'Auto', 'Pharma', 'Power',
];

function randomWalk(prev: number, volatility: number): number {
    const change = (Math.random() - 0.48) * volatility;
    return Math.max(prev * 0.7, prev + change);
}

function generateCandle(prevClose: number, volatility: number): Omit<OHLCData, 'time'> {
    const open = prevClose * (1 + (Math.random() - 0.5) * 0.005);
    const close = randomWalk(open, volatility);
    const range = Math.abs(close - open);
    const high = Math.max(open, close) + Math.random() * range * 0.8;
    const low = Math.min(open, close) - Math.random() * range * 0.8;
    const volume = Math.floor(Math.random() * 3000000 + 200000);

    return {
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(Math.max(low, 1).toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume,
    };
}

export function generateOHLC(symbol: string, count = 200): OHLCData[] {
    const stock = NIFTY50_STOCKS.find(s => s.symbol === symbol);
    const basePrice = stock?.basePrice ?? 1000;
    const volatility = basePrice * 0.025;

    const data: OHLCData[] = [];
    let currentPrice = basePrice;

    // Start 200 trading days ago
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - count * 1.4);

    let d = new Date(startDate);

    while (data.length < count) {
        const dayOfWeek = d.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const candle = generateCandle(currentPrice, volatility);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            data.push({ time: `${year}-${month}-${day}`, ...candle });
            currentPrice = candle.close;
        }
        d.setDate(d.getDate() + 1);
    }

    return data;
}

export function calculateMA(data: OHLCData[], period: number): (number | null)[] {
    return data.map((_, idx) => {
        if (idx < period - 1) return null;
        const slice = data.slice(idx - period + 1, idx + 1);
        const avg = slice.reduce((sum, c) => sum + c.close, 0) / period;
        return parseFloat(avg.toFixed(2));
    });
}

export function calculateRSI(data: OHLCData[], period = 14): number {
    if (data.length < period + 1) return 50;
    const closes = data.slice(-period - 1).map(d => d.close);
    let gains = 0, losses = 0;
    for (let i = 1; i < closes.length; i++) {
        const diff = closes[i] - closes[i - 1];
        if (diff > 0) gains += diff;
        else losses -= diff;
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return parseFloat((100 - 100 / (1 + rs)).toFixed(2));
}

export interface StockSummary {
    symbol: string;
    name: string;
    sector: string;
    price: number;
    change: number;
    changePct: number;
    volume: number;
    rsi: number;
    signal: 'BUY' | 'SELL' | 'HOLD';
}

export function generateAllStockSummaries(): StockSummary[] {
    return NIFTY50_STOCKS.map(stock => {
        const data = generateOHLC(stock.symbol, 30);
        const last = data[data.length - 1];
        const prev = data[data.length - 2];
        const change = parseFloat((last.close - prev.close).toFixed(2));
        const changePct = parseFloat(((change / prev.close) * 100).toFixed(2));
        const rsi = calculateRSI(data);
        const signal: 'BUY' | 'SELL' | 'HOLD' = rsi < 35 ? 'BUY' : rsi > 65 ? 'SELL' : 'HOLD';

        return {
            symbol: stock.symbol,
            name: stock.name,
            sector: stock.sector,
            price: last.close,
            change,
            changePct,
            volume: last.volume,
            rsi,
            signal,
        };
    });
}

export function generateSectorHeatmapData(): { name: string; value: number }[] {
    return SECTORS.map(sector => ({
        name: sector,
        value: parseFloat(((Math.random() - 0.45) * 4).toFixed(2)),
    }));
}
