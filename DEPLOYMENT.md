# 🚀 Panduan Deployment ke Vercel

## Langkah-langkah Deployment

### 1. Persiapan Repository GitHub

```bash
# Inisialisasi Git repository
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit: XAUUSD Telegram Trading Bot"

# Tambahkan remote GitHub (ganti dengan URL repository Anda)
git remote add origin https://github.com/username/xauusd-telegram-bot.git

# Push ke GitHub
git push -u origin main
```

### 2. Setup di Vercel

1. **Buka [vercel.com](https://vercel.com)** dan login dengan GitHub
2. **Klik "New Project"**
3. **Import repository** yang sudah dibuat di GitHub
4. **Configure Project:**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (default)
   - Build and Output Settings: (biarkan default)

### 3. Environment Variables

Di dashboard Vercel, tambahkan environment variables:

```
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
TELEGRAM_CHAT_ID=your_actual_chat_id_here
```

**Optional (untuk security webhook):**

```
TRADINGVIEW_SECRET=your_webhook_secret_here
```

### 4. Deploy

1. **Klik "Deploy"**
2. **Tunggu proses build** (biasanya 1-2 menit)
3. **Dapatkan URL deployment** (contoh: `https://xauusd-bot-abc123.vercel.app`)

### 5. Update TradingView Webhook

Ganti URL webhook di TradingView alerts dengan URL Vercel:

```
https://your-project-name.vercel.app/api/webhook
```

## ✅ Verifikasi Deployment

### Test Dashboard

1. Buka URL Vercel Anda
2. Pastikan dashboard loading dengan benar
3. Test konfigurasi Telegram

### Test Webhook

1. Kirim POST request ke `/api/webhook`:

```bash
curl -X POST https://your-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "XAUUSD",
    "action": "BUY",
    "price": 2010.50,
    "stop_loss": 1990.50,
    "take_profit": 2050.50,
    "timeframe": "1H",
    "reason": "Test signal",
    "strategy": "Manual Test"
  }'
```

### Test Telegram

1. Di dashboard, masukkan bot token dan chat ID
2. Klik "Test Connection"
3. Pastikan menerima pesan test di Telegram

## 🔧 Troubleshooting

### Build Errors

- **Module not found**: Pastikan semua dependencies terinstall
- **Environment variables**: Pastikan semua env vars sudah di-set di Vercel

### Runtime Errors

- **Telegram API errors**: Cek bot token dan chat ID
- **Webhook timeout**: Pastikan function timeout di vercel.json
- **CORS errors**: Cek headers di vercel.json

### Performance

- **Cold start**: Vercel free tier memiliki cold start, normal untuk request pertama
- **Function timeout**: Max 10 detik untuk free tier
- **Memory limit**: 1024MB untuk free tier

## 📊 Monitoring

### Vercel Dashboard

- **Function logs**: Monitor di tab "Functions"
- **Analytics**: Lihat usage di tab "Analytics"
- **Deployments**: History deployment di tab "Deployments"

### Custom Monitoring

```javascript
// Tambahkan di webhook route untuk logging
console.log("Signal received:", {
  symbol: signal.symbol,
  action: signal.action,
  timestamp: new Date().toISOString(),
});
```

## 🔄 Update Deployment

Untuk update code:

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel akan otomatis re-deploy setiap kali ada push ke main branch.

## 💰 Biaya Vercel

**Free Tier Limits:**

- 100GB bandwidth per bulan
- 100GB-hours function execution
- 1000 serverless function invocations per hari
- Domain custom (opsional)

Untuk bot trading normal, free tier sudah lebih dari cukup.

## 🔐 Security Best Practices

1. **Jangan commit file `.env`** (sudah ada di .gitignore)
2. **Gunakan webhook secret** untuk validasi TradingView
3. **Monitor function logs** untuk aktivitas mencurigakan
4. **Rotate bot token** secara berkala
5. **Batasi chat ID** yang boleh menerima sinyal

## 📱 Domain Custom (Opsional)

1. **Beli domain** (contoh: tradingbot.com)
2. **Di Vercel dashboard**, go to project settings
3. **Domains tab**, tambahkan domain custom
4. **Update DNS** sesuai instruksi Vercel
5. **Update webhook URL** di TradingView

## 🆘 Support

Jika ada masalah deployment:

1. Cek Vercel function logs
2. Cek GitHub Actions (jika ada)
3. Test local terlebih dahulu dengan `npm run build`
4. Buat issue di repository untuk bantuan
