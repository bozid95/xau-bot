# 📈 Panduan Menghubungkan ke TradingView

## 🎯 Overview

Setelah bot Telegram berhasil dikonfigurasi, sekarang kita akan menghubungkan TradingView untuk mengirim sinyal trading otomatis.

## 💰 TradingView Pricing & Alert Limitations

**PENTING:** TradingView webhook hanya tersedia di plan berbayar!

### Free Plan (Gratis)

- ✅ 1 alert aktif
- ✅ Email & popup notifications
- ❌ **Tidak ada webhook support**
- ❌ Tidak bisa automation

### Pro Plan ($14.95/bulan) - **MINIMUM untuk Bot**

- ✅ 20 alerts aktif
- ✅ **Webhook support** 🎯
- ✅ SMS notifications
- ✅ Priority customer support

### Pro+ Plan ($29.95/bulan)

- ✅ 100 alerts aktif
- ✅ Semua fitur Pro

### Premium Plan ($59.95/bulan)

- ✅ 400 alerts aktif
- ✅ Semua fitur Pro+

**💡 Recommendation:** Pro Plan sudah cukup untuk bot automation dengan 20 alerts.

### Alternative untuk Free Users:

1. **Email alerts** → Manual copy ke bot
2. **Upgrade ke Pro** untuk full automation
3. **Alternative services** (TradingConnector, dll)

## 🚀 STEP 1: Deploy Bot ke Vercel (Wajib)

**PENTING:** TradingView webhook membutuhkan URL HTTPS yang public. Local development (localhost) tidak bisa digunakan.

### 1.1 Push ke GitHub

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit
git commit -m "Initial XAUUSD Trading Bot"

# Buat repository di GitHub dan push
git remote add origin https://github.com/username/xauusd-bot.git
git push -u origin main
```

### 1.2 Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Klik "New Project"
4. Import repository GitHub Anda
5. **PENTING:** Tambahkan Environment Variables:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   TELEGRAM_CHAT_ID=your_chat_id
   ```
6. Klik Deploy
7. **Copy URL deployment** (contoh: `https://xauusd-bot-abc123.vercel.app`)

## 📊 STEP 2: Setup TradingView Alert

### 2.1 Buka TradingView

1. Pergi ke [TradingView.com](https://tradingview.com)
2. Buka chart **XAUUSD**
3. Pilih timeframe yang diinginkan (contoh: 1H)

### 2.2 Buat Alert Baru

1. **Klik icon "Alert"** (bell icon) di toolbar atas
2. **Atau tekan Alt + A**
3. **Atau klik kanan di chart → Add Alert**

### 2.3 Konfigurasi Alert

#### **Condition (Kondisi):**

Pilih kondisi yang diinginkan, contoh:

- **Price**: XAUUSD crosses above/below price level
- **Indicator**: Moving Average cross, RSI levels, dll
- **Drawing**: Trendline break, support/resistance

#### **Settings:**

- **Frequency**: Pilih **"Once Per Bar Close"** (recommended)
- **Expiration**: Set sesuai strategy (contoh: 1 day untuk day trading)

#### **Notifications:**

1. **Centang "Webhook URL"**
2. **Masukkan URL webhook Anda:**

   ```
   https://your-vercel-domain.vercel.app/api/webhook
   ```

   Ganti dengan URL Vercel Anda

3. **Di bagian "Message", masukkan JSON format:**

## 📝 STEP 3: Format Pesan JSON

### Format Basic (Copy-paste ini):

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": {{close}},
  "stop_loss": {{close}} - 20,
  "take_profit": {{close}} + 40,
  "timeframe": "{{interval}}",
  "reason": "Alert triggered on {{interval}} timeframe",
  "strategy": "TradingView Alert"
}
```

### Format Advanced dengan Kondisi:

```json
{
  "symbol": "XAUUSD",
  "action": "{{strategy.order.action}}",
  "price": {{close}},
  "stop_loss": {{close}} - 15,
  "take_profit": {{close}} + 30,
  "timeframe": "{{interval}}",
  "reason": "Signal from {{interval}} chart",
  "strategy": "Auto Trading Strategy",
  "timestamp": "{{time}}"
}
```

### Format untuk SELL Signal:

```json
{
  "symbol": "XAUUSD",
  "action": "SELL",
  "price": {{close}},
  "stop_loss": {{close}} + 20,
  "take_profit": {{close}} - 40,
  "timeframe": "{{interval}}",
  "reason": "Sell signal triggered",
  "strategy": "TradingView SELL Alert"
}
```

## 🎯 STEP 4: Contoh Setup Alert Populer

### 1. **Moving Average Crossover**

**Condition:** Moving Average Convergence/Divergence → MACD crosses above Signal
**Message:**

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": {{close}},
  "stop_loss": {{close}} - 25,
  "take_profit": {{close}} + 50,
  "timeframe": "{{interval}}",
  "reason": "MACD bullish crossover",
  "strategy": "MACD Strategy"
}
```

### 2. **RSI Overbought/Oversold**

**Condition:** Relative Strength Index → RSI crosses below 30
**Message:**

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": {{close}},
  "stop_loss": {{close}} - 15,
  "take_profit": {{close}} + 30,
  "timeframe": "{{interval}}",
  "reason": "RSI oversold signal",
  "strategy": "RSI Reversal"
}
```

### 3. **Support/Resistance Break**

**Condition:** Price → Crosses above 2050
**Message:**

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": {{close}},
  "stop_loss": 2030,
  "take_profit": 2080,
  "timeframe": "{{interval}}",
  "reason": "Resistance breakout at 2050",
  "strategy": "Breakout Strategy"
}
```

## 🧪 STEP 5: Test Alert

### 5.1 Test Webhook Manual

Buka terminal dan test webhook dengan curl:

```bash
curl -X POST https://your-vercel-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "XAUUSD",
    "action": "BUY",
    "price": 2010.50,
    "stop_loss": 1990.50,
    "take_profit": 2050.50,
    "timeframe": "1H",
    "reason": "Manual test signal",
    "strategy": "Test Strategy"
  }'
```

### 5.2 Test Alert di TradingView

1. **Buat alert dengan frequency "All"** untuk testing
2. **Tunggu kondisi trigger**
3. **Cek apakah menerima notifikasi di Telegram**
4. **Setelah berhasil, ubah frequency ke "Once Per Bar Close"**

## 📱 STEP 6: Monitoring

### Dashboard Monitoring

- Buka https://your-vercel-domain.vercel.app
- Monitor statistics dan signal history
- Cek apakah signals masuk dengan benar

### Vercel Function Logs

- Buka Vercel dashboard
- Go to Functions tab
- Monitor logs untuk troubleshooting

## 🚨 Troubleshooting

### Alert Tidak Trigger

- ❌ **URL webhook salah** → Cek URL Vercel di alert settings
- ❌ **JSON format error** → Validasi JSON di jsonlint.com
- ❌ **Frequency setting** → Gunakan "Once Per Bar Close"

### Tidak Menerima di Telegram

- ❌ **Bot configuration** → Test di dashboard
- ❌ **Webhook failed** → Cek Vercel function logs
- ❌ **Environment variables** → Pastikan set di Vercel

### Error 500/400

- ❌ **Invalid JSON** → Cek format message di alert
- ❌ **Missing fields** → Pastikan symbol, action, price ada
- ❌ **Server error** → Cek Vercel function logs

## 💡 Tips Optimasi

### 1. **Multiple Timeframes**

Buat alert terpisah untuk setiap timeframe:

- Scalping: 1m, 5m alerts
- Day trading: 15m, 1h alerts
- Swing: 4h, 1D alerts

### 2. **Risk Management**

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": {{close}},
  "stop_loss": {{close}} - 20,
  "take_profit": {{close}} + 40,
  "position_size": 0.1,
  "risk_percent": 2,
  "timeframe": "{{interval}}",
  "reason": "Calculated risk signal",
  "strategy": "Risk Managed Trade"
}
```

### 3. **Conditional Alerts**

Gunakan Pine Script untuk kondisi yang lebih complex:

```pinescript
//@version=5
strategy("XAUUSD Alert", overlay=true)

// Conditions
bullishCross = ta.crossover(ta.ema(close, 21), ta.ema(close, 50))
bearishCross = ta.crossunder(ta.ema(close, 21), ta.ema(close, 50))

// Alerts
if bullishCross
    alert('{"symbol":"XAUUSD","action":"BUY","price":' + str.tostring(close) + ',"stop_loss":' + str.tostring(close - 20) + ',"take_profit":' + str.tostring(close + 40) + ',"timeframe":"{{interval}}","reason":"EMA Cross Bullish","strategy":"EMA Cross"}', alert.freq_once_per_bar_close)

if bearishCross
    alert('{"symbol":"XAUUSD","action":"SELL","price":' + str.tostring(close) + ',"stop_loss":' + str.tostring(close + 20) + ',"take_profit":' + str.tostring(close - 40) + ',"timeframe":"{{interval}}","reason":"EMA Cross Bearish","strategy":"EMA Cross"}', alert.freq_once_per_bar_close)
```

## ✅ Checklist Setup

- [ ] ✅ Bot di-deploy ke Vercel
- [ ] ✅ Environment variables di-set di Vercel
- [ ] ✅ Webhook URL di-copy dari Vercel
- [ ] ✅ Alert dibuat di TradingView
- [ ] ✅ Webhook URL dimasukkan ke alert
- [ ] ✅ JSON message format di-copy ke alert
- [ ] ✅ Alert di-test dan berfungsi
- [ ] ✅ Menerima notifikasi di Telegram
- [ ] ✅ Dashboard menampilkan signal history

Setelah mengikuti panduan ini, bot Anda akan otomatis menerima sinyal dari TradingView dan mengirimkannya ke Telegram! 🚀

## 🎯 Langkah Selanjutnya

1. **Test dengan alert sederhana dulu** (price level)
2. **Setelah berhasil, buat strategy yang lebih complex**
3. **Monitor performance dan optimasi**
4. **Tambahkan multiple alerts untuk diversifikasi**
