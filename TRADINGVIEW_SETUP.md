# 📈 Contoh Setup TradingView Alerts

## Format Pesan Alert untuk Webhook

### 1. Basic Signal Format

```json
{
  "symbol": "XAUUSD",
  "action": "{{strategy.order.action}}",
  "price": {{close}},
  "timeframe": "{{interval}}",
  "timestamp": "{{time}}"
}
```

### 2. Advanced Signal dengan Stop Loss & Take Profit

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": {{close}},
  "stop_loss": {{close}} - 20,
  "take_profit": {{close}} + 40,
  "timeframe": "{{interval}}",
  "reason": "Golden Cross detected on {{interval}} timeframe",
  "strategy": "Moving Average Cross",
  "timestamp": "{{time}}"
}
```

### 3. Signal dengan Multiple TP Levels

```json
{
  "symbol": "XAUUSD",
  "action": "SELL",
  "price": {{close}},
  "stop_loss": {{close}} + 15,
  "take_profit": {{close}} - 30,
  "take_profit_2": {{close}} - 50,
  "timeframe": "{{interval}}",
  "reason": "RSI Overbought + Resistance level",
  "strategy": "RSI + Support/Resistance",
  "confidence": 85
}
```

### 4. Close Position Signal

```json
{
  "symbol": "XAUUSD",
  "action": "CLOSE",
  "price": {{close}},
  "timeframe": "{{interval}}",
  "reason": "Take profit reached",
  "strategy": "Exit Strategy"
}
```

## Setup di TradingView

### 1. Buat Alert Baru

1. Buka chart XAUUSD
2. Klik ikon "Alert" (bell icon)
3. Pilih kondisi alert (Price, Indicator, Drawing, dll)

### 2. Konfigurasi Webhook

1. Di bagian "Notifications"
2. Centang "Webhook URL"
3. Masukkan URL: `https://your-domain.vercel.app/api/webhook`
4. Paste salah satu format JSON di atas ke "Message"

### 3. Contoh Setup untuk Moving Average Cross

**Condition:** Moving Average Cross
**Message:**

```json
{
  "symbol": "XAUUSD",
  "action": "{{strategy.order.action}}",
  "price": {{close}},
  "stop_loss": {{close}} - 20,
  "take_profit": {{close}} + 40,
  "timeframe": "{{interval}}",
  "reason": "MA Cross Signal",
  "strategy": "EMA 21 x EMA 50"
}
```

### 4. Contoh Setup untuk RSI Overbought/Oversold

**Condition:** RSI crossing levels
**Message:**

```json
{
  "symbol": "XAUUSD",
  "action": "{{plot_0 > 70 ? 'SELL' : 'BUY'}}",
  "price": {{close}},
  "stop_loss": "{{plot_0 > 70 ? close + 15 : close - 15}}",
  "take_profit": "{{plot_0 > 70 ? close - 30 : close + 30}}",
  "timeframe": "{{interval}}",
  "reason": "RSI {{plot_0 > 70 ? 'Overbought' : 'Oversold'}}",
  "strategy": "RSI Reversal",
  "rsi_value": {{plot_0}}
}
```

## Variabel TradingView Yang Tersedia

### Price Variables

- `{{open}}` - Harga open
- `{{high}}` - Harga high
- `{{low}}` - Harga low
- `{{close}}` - Harga close
- `{{volume}}` - Volume

### Time Variables

- `{{time}}` - Timestamp
- `{{interval}}` - Timeframe (1m, 5m, 1h, dll)

### Strategy Variables

- `{{strategy.order.action}}` - BUY/SELL
- `{{strategy.order.contracts}}` - Jumlah kontrak
- `{{strategy.order.price}}` - Harga order

### Indicator Variables

- `{{plot_0}}` - Nilai plot pertama indicator
- `{{plot_1}}` - Nilai plot kedua indicator
- dst.

## Tips Setup Alert

### 1. Frequency Setting

- **Once Per Bar Close** - Recommended untuk trading
- **Once Per Bar** - Untuk monitoring
- **All** - Untuk testing (hati-hati spam)

### 2. Expiration

- Set expiration time sesuai strategy
- Untuk scalping: 1-4 jam
- Untuk swing: 1-7 hari

### 3. Testing

1. Test alert dengan frequency "All" dulu
2. Pastikan webhook berhasil diterima
3. Cek format pesan di dashboard
4. Ubah ke "Once Per Bar Close" untuk trading

### 4. Multiple Timeframes

Buat alert terpisah untuk setiap timeframe:

- Scalping: 1m, 5m
- Day trading: 15m, 1h
- Swing: 4h, 1D

## Contoh Strategy Populer

### 1. EMA Crossover

```
Condition: EMA(21) crosses above/below EMA(50)
Action: BUY ketika cross up, SELL ketika cross down
SL: 20 pips
TP: 40 pips
```

### 2. RSI Divergence

```
Condition: RSI divergence dengan price
Action: Counter-trend trade
SL: Previous swing high/low
TP: Next support/resistance
```

### 3. Support/Resistance Breakout

```
Condition: Price break above resistance / below support
Action: Follow breakout direction
SL: Back inside support/resistance
TP: Next significant level
```

## Monitoring & Optimization

### 1. Track Performance

- Monitor win rate di dashboard
- Analisis timing sinyal
- Evaluasi risk-reward ratio

### 2. Adjust Parameters

- Fine-tune SL/TP berdasarkan hasil
- Sesuaikan timeframe untuk strategy
- Optimize indicator settings

### 3. Risk Management

- Batasi jumlah sinyal per hari
- Set maximum drawdown
- Diversifikasi strategy

---

**Note:** Selalu backtest strategy sebelum menggunakan di live trading!
