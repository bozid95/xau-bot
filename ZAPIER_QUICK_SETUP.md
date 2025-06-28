# 📧 Quick Reference: Zapier Setup untuk XAUUSD Bot

## 🎯 Setup Zapier dalam 10 Menit

### **📋 Yang Dibutuhkan:**

- ✅ Account Zapier (gratis/paid)
- ✅ Bot sudah deployed di Vercel
- ✅ Email Gmail untuk TradingView alerts

---

## 🚀 **STEP 1: Buat Zap Baru**

1. **Login** ke [zapier.com](https://zapier.com)
2. **Klik** "Create Zap"
3. **Nama:** "TradingView to XAUUSD Bot"

---

## 📧 **STEP 2: Setup Email Trigger**

### **Choose App:** Email by Zapier

### **Event:** New Inbound Email

### **Result:** Zapier memberikan email robot

```
Contoh: abc123@robot.zapier.com
```

⚠️ **PENTING:** Simpan email ini untuk step selanjutnya!

---

## 🔗 **STEP 3: Setup Webhook Action**

### **Choose App:** Webhooks by Zapier

### **Event:** POST

### **Configuration:**

```json
URL: https://your-bot.vercel.app/api/webhook
Method: POST
Payload Type: JSON

Data:
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": 2650.50,
  "stop_loss": 2630.50,
  "take_profit": 2680.50,
  "timeframe": "1H",
  "reason": "{{1.Subject}}",
  "strategy": "Email Bridge",
  "source": "zapier",
  "email_body": "{{1.Body_Plain}}",
  "timestamp": "{{1.Date}}"
}
```

---

## 📈 **STEP 4: Setup TradingView Alert**

1. **Buka** TradingView → Chart XAUUSD
2. **Buat Alert** (Alt + A)
3. **Setup kondisi** sesuai strategy
4. **Notifications:**

   - ✅ **Centang "Send email"**
   - **Email:** `abc123@robot.zapier.com` (dari step 2)
   - **Subject:** `XAUUSD BUY Alert`
   - **Message:**

   ```
   XAUUSD Signal Alert

   Action: BUY
   Price: {{close}}
   Time: {{time}}
   Timeframe: {{interval}}

   Stop Loss: {{close}} - 20
   Take Profit: {{close}} + 40
   ```

---

## 🧪 **STEP 5: Test Complete Flow**

### **Test Sequence:**

1. **Kirim test email** ke robot Zapier email
2. **Cek Zapier dashboard** → Zap History
3. **Cek webhook logs** di Vercel
4. **Cek Telegram** untuk notifikasi

### **Expected Result:**

```
📊 XAUUSD Signal Alert

Symbol: XAUUSD
Action: BUY
Price: 2650.50
Stop Loss: 2630.50
Take Profit: 2680.50
Timeframe: 1H

Reason: Email alert from TradingView
Strategy: Email Bridge
Source: Zapier

Time: 2025-06-29 10:30:00
```

---

## 🎯 **Advanced: Email Parsing**

### **Untuk parsing yang lebih akurat, tambahkan Formatter:**

1. **Add Step** antara Email dan Webhook
2. **Choose:** Formatter by Zapier → Text → Extract Pattern
3. **Pattern Setup:**
   ```
   Input: {{1.Body_Plain}}
   Pattern: Action: (BUY|SELL).*Price: ([\d.]+)
   ```
4. **Update Webhook payload:**
   ```json
   {
     "action": "{{2.Match_1}}",
     "price": "{{2.Match_2}}",
     "stop_loss": "{{2.Match_2}} - 20",
     "take_profit": "{{2.Match_2}} + 40"
   }
   ```

---

## 💰 **Pricing Consideration**

### **Free Plan:** (100 tasks/month)

- ✅ Cukup untuk testing
- ❌ 15 menit delay
- ❌ Single-step Zaps

### **Starter Plan:** ($19.99/month)

- ✅ 750 tasks/month (25/day)
- ✅ **Instant triggers** 🎯
- ✅ Multi-step Zaps
- ✅ **Recommended untuk trading**

---

## 🚨 **Troubleshooting**

### **Email tidak terdeteksi:**

- ❌ Email address salah → Cek robot email
- ❌ TradingView email disabled → Enable notifications
- ❌ Email di spam → Check spam folder

### **Webhook gagal:**

- ❌ URL salah → Verify deployment URL
- ❌ JSON format error → Validate with jsonlint.com
- ❌ Bot offline → Check Vercel logs

### **Telegram tidak menerima:**

- ❌ Bot token/chat ID salah → Test di dashboard
- ❌ Bot blocked → Unblock dan restart

---

## ✅ **Quick Checklist**

- [ ] ✅ Zapier Zap created
- [ ] ✅ Email trigger configured
- [ ] ✅ Robot email copied
- [ ] ✅ Webhook action setup
- [ ] ✅ URL pointing to correct endpoint
- [ ] ✅ TradingView alert created
- [ ] ✅ Alert sending to robot email
- [ ] ✅ Test email sent and processed
- [ ] ✅ Telegram notification received
- [ ] ✅ Zap turned ON

---

## 🎉 **Success!**

Setelah setup selesai, Anda akan mendapat:

✅ **Automation penuh** dari TradingView Free  
✅ **Real-time notifications** ke Telegram  
✅ **Unlimited alerts** (tergantung Zapier plan)  
✅ **Professional monitoring** dashboard  
✅ **Backup strategy** untuk trading signals

**Total setup time: 10-15 menit**  
**Lifetime automation dengan biaya minimal!** 🚀

---

_💡 Pro Tip: Setup multiple email templates untuk different strategies (scalping, swing, day trading) dan monitor performance melalui dashboard bot._
