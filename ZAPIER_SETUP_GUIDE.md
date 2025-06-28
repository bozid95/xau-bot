# 📧 Panduan Setup Zapier untuk XAUUSD Trading Bot

## 🎯 Overview

Zapier memungkinkan Anda untuk mengirim sinyal trading dari email (TradingView free alerts) langsung ke Telegram bot tanpa perlu upgrade ke TradingView Pro. Setup ini cocok untuk user yang ingin menggunakan TradingView gratis tapi tetap mendapat automation.

## 💡 Konsep Kerja

```
TradingView (Free) → Email Alert → Zapier → Webhook → Telegram Bot
```

1. **TradingView** mengirim alert via email (gratis)
2. **Zapier** mendeteksi email masuk dan parse content
3. **Zapier** mengirim data ke webhook bot Anda
4. **Bot** menerima signal dan kirim ke Telegram

## 🚀 STEP 1: Persiapan

### 1.1 Yang Dibutuhkan:

- ✅ Email account (Gmail recommended)
- ✅ Zapier account (gratis/paid)
- ✅ Bot sudah deployed di Vercel
- ✅ Webhook URL bot ready

### 1.2 Info yang Diperlukan:

```
Bot Webhook URL: https://your-bot.vercel.app/api/webhook
Gmail untuk alerts: your-email@gmail.com
```

## 📋 STEP 2: Setup Zapier Zap

### 2.1 Buat Zap Baru

1. Login ke [zapier.com](https://zapier.com)
2. Klik **"Create Zap"**
3. Pilih nama: "TradingView to XAUUSD Bot"

### 2.2 Setup Trigger (Step 1)

#### **Choose App:**

- Search: **"Email by Zapier"**
- Select: **"Email by Zapier"**

#### **Choose Event:**

- Select: **"New Inbound Email"**
- Click **"Continue"**

#### **Setup Account:**

- Zapier akan memberikan **unique email address**
- Copy email ini: `something@robot.zapier.com`
- **PENTING:** Simpan email ini untuk TradingView setup

#### **Test Trigger:**

- Kirim test email ke email Zapier
- Zapier akan detect email masuk
- Click **"Continue"**

### 2.3 Setup Action (Step 2)

#### **Choose App:**

- Search: **"Webhooks by Zapier"**
- Select: **"Webhooks by Zapier"**

#### **Choose Event:**

- Select: **"POST"**
- Click **"Continue"**

#### **Setup Action:**

**URL:**

```
https://your-bot.vercel.app/api/webhook
```

_Ganti dengan URL deployment Vercel Anda_

**Payload Type:**

```
JSON
```

**Data Mapping:**

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": 2650.5,
  "stop_loss": 2630.5,
  "take_profit": 2680.5,
  "timeframe": "1H",
  "reason": "Email alert from TradingView",
  "strategy": "Email Bridge",
  "source": "zapier",
  "email_subject": "{{1.Subject}}",
  "email_body": "{{1.Body_Plain}}",
  "timestamp": "{{1.Date}}"
}
```

**Headers:**

```
Content-Type: application/json
```

### 2.4 Test Action

1. Click **"Test & Continue"**
2. Zapier akan kirim test webhook
3. Cek Telegram - harus menerima notifikasi
4. Jika berhasil, click **"Turn on Zap"**

## 📈 STEP 3: Setup TradingView Email Alert

### 3.1 Buka TradingView

1. Login ke [tradingview.com](https://tradingview.com)
2. Buka chart **XAUUSD**
3. Buat alert baru (Alt + A)

### 3.2 Configure Alert

#### **Condition:**

- Pilih kondisi sesuai strategy Anda
- Contoh: Price crosses above/below level

#### **Settings:**

- **Frequency:** "Once Per Bar Close"
- **Expiration:** Set sesuai kebutuhan

#### **Notifications:**

1. **Centang "Send email"**
2. **Email Address:** Masukkan email Zapier robot

   ```
   something@robot.zapier.com
   ```

   _(Email yang didapat dari Zapier step 2.2)_

3. **Email Subject:**

   ```
   XAUUSD {{strategy.order.action}} Alert
   ```

4. **Email Message:**

   ```
   XAUUSD Signal Alert

   Action: {{strategy.order.action}}
   Price: {{close}}
   Time: {{time}}
   Timeframe: {{interval}}

   Strategy: TradingView Email Alert
   Reason: Alert triggered on {{interval}} chart

   Stop Loss: {{close}} - 20
   Take Profit: {{close}} + 40
   ```

### 3.3 Save Alert

1. Click **"Create"**
2. Alert akan aktif dan siap mengirim email

## 🔧 STEP 4: Advanced Zapier Configuration

### 4.1 Email Parsing dengan Formatter

Untuk parsing yang lebih advanced, tambahkan step Formatter:

#### **Add Step:**

1. Click **"+"** between Trigger dan Action
2. Choose **"Formatter by Zapier"**
3. Select **"Text"** → **"Extract Pattern"**

#### **Pattern Setup:**

```
Input: {{1.Body_Plain}}
Pattern: Action: (BUY|SELL).*Price: ([\d.]+)
```

#### **Use Extracted Data:**

Update webhook payload:

```json
{
  "symbol": "XAUUSD",
  "action": "{{2.Match_1}}",
  "price": "{{2.Match_2}}",
  "stop_loss": "{{2.Match_2}} - 20",
  "take_profit": "{{2.Match_2}} + 40",
  "timeframe": "1H",
  "reason": "Parsed from email: {{1.Subject}}",
  "strategy": "Email Parser",
  "source": "zapier"
}
```

### 4.2 Conditional Logic

Tambahkan **Filter** untuk hanya process email tertentu:

#### **Add Filter:**

1. Click **"+"** setelah Trigger
2. Choose **"Filter by Zapier"**
3. Setup condition:
   ```
   Subject Contains: "XAUUSD"
   AND
   Body Contains: "Action:"
   ```

### 4.3 Error Handling

Setup error notification jika webhook gagal:

#### **Add Error Handling:**

1. Go to Zap settings
2. Enable **"Send error emails"**
3. Add your email untuk notifikasi error

## 🧪 STEP 5: Testing Complete Flow

### 5.1 End-to-End Test

1. **Trigger TradingView Alert:**

   - Buat alert dengan kondisi yang mudah trigger
   - Atau edit price level agar langsung trigger

2. **Check Email:**

   - Email harus masuk ke Zapier robot email
   - Cek di Zapier dashboard → Zap History

3. **Check Webhook:**

   - Zapier harus kirim POST ke webhook
   - Bot harus terima dan process data

4. **Check Telegram:**
   - Notification harus muncul di Telegram
   - Format harus sesuai dengan template

### 5.2 Troubleshooting

#### **Email Tidak Terdeteksi:**

- ❌ Email address salah → Cek robot email Zapier
- ❌ Email di spam → Check spam folder
- ❌ TradingView email disabled → Enable email notifications

#### **Webhook Gagal:**

- ❌ URL salah → Cek deployment URL
- ❌ JSON format error → Validate di jsonlint.com
- ❌ Bot offline → Cek Vercel function logs

#### **Telegram Tidak Menerima:**

- ❌ Bot token salah → Test di dashboard
- ❌ Chat ID salah → Test manual send
- ❌ Bot blocked → Unblock dan restart

## 📊 STEP 6: Monitoring & Optimization

### 6.1 Zapier Monitoring

**Dashboard Zapier:**

- Monitor Zap runs
- Check success/failure rate
- View detailed logs

**Key Metrics:**

- Total runs per month
- Success rate %
- Average execution time

### 6.2 Performance Optimization

#### **Reduce Delay:**

- Use Zapier paid plan untuk instant triggers
- Optimize webhook response time
- Use simple JSON format

#### **Improve Accuracy:**

- Use specific email subjects
- Add data validation in webhook
- Use regex patterns untuk parsing

### 6.3 Backup Strategy

Setup multiple Zaps untuk redundancy:

1. **Primary Zap:** Main email processing
2. **Backup Zap:** Alternative email account
3. **Fallback:** Manual webhook testing

## 💰 STEP 7: Zapier Pricing Considerations

### Free Plan:

- ✅ 100 tasks/month
- ✅ 5 Zaps
- ❌ 15 minute delays
- ❌ Single-step Zaps only

### Starter Plan ($19.99/month):

- ✅ 750 tasks/month
- ✅ Instant triggers
- ✅ Multi-step Zaps
- ✅ Premium apps

### Professional Plan ($49/month):

- ✅ 2,000 tasks/month
- ✅ Advanced features
- ✅ Custom logic
- ✅ Error recovery

**Recommendation:** Starter plan untuk trading automation serious.

## 📝 STEP 8: Email Template Examples

### 8.1 Simple Format

**Subject:**

```
XAUUSD Alert - {{strategy.order.action}}
```

**Body:**

```
Symbol: XAUUSD
Action: {{strategy.order.action}}
Price: {{close}}
Time: {{time}}
Timeframe: {{interval}}
```

### 8.2 Advanced Format

**Subject:**

```
[XAUUSD] {{strategy.order.action}} Signal - {{interval}}
```

**Body:**

```
=== XAUUSD TRADING SIGNAL ===

Action: {{strategy.order.action}}
Entry Price: {{close}}
Stop Loss: {{close}} - 20
Take Profit: {{close}} + 40

Chart: {{interval}} timeframe
Time: {{time}}
Strategy: {{strategy.order.comment}}

Risk Management:
- Position Size: 1% risk
- R:R Ratio: 1:2

=== END SIGNAL ===
```

### 8.3 JSON-like Format

**Subject:**

```
XAUUSD_DATA
```

**Body:**

```
DATA_START
symbol=XAUUSD
action={{strategy.order.action}}
price={{close}}
sl={{close}}-20
tp={{close}}+40
timeframe={{interval}}
time={{time}}
DATA_END
```

## ✅ STEP 9: Final Checklist

### Setup Verification:

- [ ] ✅ Zapier Zap created and active
- [ ] ✅ Email trigger configured
- [ ] ✅ Webhook action pointing to correct URL
- [ ] ✅ TradingView alert sending to Zapier email
- [ ] ✅ Test email sent and processed
- [ ] ✅ Webhook received and processed
- [ ] ✅ Telegram notification received
- [ ] ✅ Data format correct in Telegram
- [ ] ✅ Error handling configured
- [ ] ✅ Monitoring dashboard setup

### Production Ready:

- [ ] ✅ Multiple alerts configured
- [ ] ✅ Different timeframes tested
- [ ] ✅ Backup Zaps created
- [ ] ✅ Error notifications setup
- [ ] ✅ Performance monitoring active

## 🎯 Summary

Dengan setup Zapier ini, Anda bisa:

1. **Menggunakan TradingView Free** untuk unlimited alerts
2. **Automation penuh** tanpa manual copy-paste
3. **Real-time notifications** ke Telegram
4. **Multiple strategies** dalam satu setup
5. **Professional monitoring** dengan dashboard

**Total cost: $0 (Zapier free) atau $19.99/month (Zapier Starter) vs $14.95/month (TradingView Pro)**

**Setup time: 30-45 minutes sekali setup, lifetime automation!** 🚀

---

_Guide ini memberikan automation level professional dengan biaya minimal dan fleksibilitas maksimal untuk XAUUSD trading signals._
