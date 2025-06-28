# 🥇 XAUUSD Telegram Trading Bot

Bot Telegram untuk sinyal trading XAUUSD (Gold) dengan integrasi TradingView dan dashboard web menggunakan Next.js. Bot ini dapat menerima sinyal dari TradingView webhooks dan mengirimkan notifikasi real-time ke Telegram.

## ✨ Fitur Utama

- 📱 **Notifikasi Telegram Real-time** - Sinyal trading langsung ke chat Telegram Anda
- 📊 **Dashboard Web Monitoring** - Interface modern untuk monitoring dan konfigurasi
- 🔗 **TradingView Integration** - Terima sinyal langsung dari TradingView alerts
- 🚀 **Deploy Gratis di Vercel** - Optimized untuk serverless deployment
- 🛡️ **Validasi Sinyal** - Built-in validation untuk memastikan kualitas sinyal
- 📈 **Riwayat Sinyal** - Tracking dan monitoring semua sinyal yang diterima

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 dengan App Router
- **Styling**: Tailwind CSS
- **Bot**: Telegram Bot API
- **Webhook**: TradingView Alerts
- **Deployment**: Vercel (gratis)

## 🚀 Quick Start

### 1. Setup Bot Telegram

1. Buat bot baru dengan [@BotFather](https://t.me/botfather)
2. Copy token bot yang diberikan
3. Mulai chat dengan bot Anda
4. Dapatkan Chat ID dari [@userinfobot](https://t.me/userinfobot)

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk mengakses dashboard.

### 5. Setup TradingView Alerts

1. Buka TradingView dan buat alert baru
2. Di bagian "Notifications", pilih "Webhook URL"
3. Masukkan URL: `https://your-domain.vercel.app/api/webhook`
4. Di "Message", gunakan format JSON:

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": {{close}},
  "stop_loss": {{close}} - 20,
  "take_profit": {{close}} + 40,
  "timeframe": "{{interval}}",
  "reason": "Your trading reason here",
  "strategy": "Your strategy name"
}
```

## 🌐 Deploy ke Vercel

1. Push ke GitHub repository
2. Import project di [vercel.com](https://vercel.com)
3. Tambahkan Environment Variables di Vercel dashboard
4. Deploy!

## 📊 Dashboard Features

- **Real-time Stats**: Monitor total sinyal dan aktivitas hari ini
- **Telegram Config**: Setup dan test koneksi bot
- **Signal History**: Riwayat sinyal dengan detail lengkap
- **Webhook Setup**: Panduan konfigurasi TradingView

## 🔧 API Endpoints

- `POST /api/webhook` - Menerima sinyal dari TradingView
- `POST /api/test-telegram` - Test koneksi Telegram
- `GET /api/stats` - Statistik bot
- `GET /api/signals` - Riwayat sinyal

**Disclaimer**: Bot ini hanya untuk tujuan edukasi. Selalu lakukan riset sendiri sebelum melakukan trading.
