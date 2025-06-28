# 🔧 Zapier Error Fix: "Missing required field: symbol"

## 🎯 **Quick Fix untuk Error Zapier**

### **Root Cause:**

Error "Missing required field: symbol" terjadi karena JSON data di Zapier webhook tidak memiliki field `symbol` atau format JSON salah.

## 🚀 **STEP-BY-STEP FIX:**

### **STEP 1: Test dengan Debug Endpoint**

1. **Ubah Zapier Webhook URL ke test endpoint:**

   ```
   https://your-bot.vercel.app/api/test-zapier
   ```

2. **Test Action di Zapier**
3. **Lihat response untuk debugging info**

### **STEP 2: Fix JSON Format di Zapier**

Di Zapier Webhook Action, pada bagian **"Data"**, pastikan format EXACTLY seperti ini:

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": "2650.50",
  "stop_loss": "2630.50",
  "take_profit": "2680.50",
  "timeframe": "1H",
  "reason": "Zapier email alert",
  "strategy": "Email Bridge"
}
```

### **STEP 3: Common JSON Mistakes & Fixes**

| ❌ **Wrong**            | ✅ **Correct**         | **Issue**                        |
| ----------------------- | ---------------------- | -------------------------------- |
| `{symbol: "XAUUSD"}`    | `{"symbol": "XAUUSD"}` | Missing quotes around field name |
| `{"symbol" "XAUUSD"}`   | `{"symbol": "XAUUSD"}` | Missing colon                    |
| `{"symbol": "XAUUSD",}` | `{"symbol": "XAUUSD"}` | Trailing comma                   |
| `{'symbol': 'XAUUSD'}`  | `{"symbol": "XAUUSD"}` | Single quotes not allowed        |
| `{symbol: XAUUSD}`      | `{"symbol": "XAUUSD"}` | Unquoted string value            |

### **STEP 4: Detailed Zapier Configuration**

#### **4.1 Di Zapier Webhook Action:**

**URL:**

```
https://your-bot.vercel.app/api/webhook
```

**Method:**

```
POST
```

**Data (Copy exact format):**

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": "2650.50",
  "stop_loss": "2630.50",
  "take_profit": "2680.50",
  "timeframe": "1H",
  "reason": "Email from TradingView",
  "strategy": "Email Bridge",
  "source": "zapier"
}
```

**Headers:**

```
Content-Type: application/json
```

#### **4.2 Advanced: Dynamic Values dari Email**

Jika ingin parse data dari email content:

```json
{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": "2650.50",
  "stop_loss": "2630.50",
  "take_profit": "2680.50",
  "timeframe": "1H",
  "reason": "{{1.Subject}}",
  "strategy": "Email Bridge",
  "source": "zapier",
  "email_body": "{{1.Body_Plain}}"
}
```

### **STEP 5: Test Sequence**

1. **Setup JSON format** di Zapier (menggunakan static values dulu)
2. **Test dengan debug endpoint** (`/api/test-zapier`)
3. **Fix semua errors** yang muncul di response
4. **Ubah URL ke production** (`/api/webhook`)
5. **Test end-to-end** dengan real email

### **STEP 6: Validation Checklist**

Sebelum test, pastikan:

- [ ] ✅ JSON valid (test di jsonlint.com)
- [ ] ✅ Field names dalam double quotes: `"symbol"`
- [ ] ✅ String values dalam double quotes: `"XAUUSD"`
- [ ] ✅ Numbers bisa string atau number: `"2650.50"` atau `2650.50`
- [ ] ✅ Comma setelah setiap field (kecuali terakhir)
- [ ] ✅ Curly braces: `{` dan `}`
- [ ] ✅ No trailing commas

### **STEP 7: Debugging dengan Test Endpoint**

**Test URL:**

```
https://your-bot.vercel.app/api/test-zapier
```

**Expected Response (Success):**

```json
{
  "success": true,
  "message": "Zapier webhook test successful! ✅",
  "received_data": {...},
  "next_steps": [
    "1. Your JSON format is correct",
    "2. Change webhook URL back to /api/webhook",
    "3. Turn on your Zap",
    "4. Test with real TradingView email"
  ]
}
```

**Error Response (with debugging info):**

```json
{
  "error": "Missing or empty required fields",
  "missing_fields": ["symbol"],
  "field_analysis": {...},
  "zapier_fix": {
    "instruction": "In Zapier webhook action, ensure Data field contains:",
    "required_json": {...}
  }
}
```

## 🎯 **Quick Debug Commands**

### **Test webhook manually:**

```bash
curl -X POST https://your-bot.vercel.app/api/test-zapier \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "XAUUSD",
    "action": "BUY",
    "price": "2650.50"
  }'
```

### **Test production webhook:**

```bash
curl -X POST https://your-bot.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "XAUUSD",
    "action": "BUY",
    "price": "2650.50",
    "stop_loss": "2630.50",
    "take_profit": "2680.50",
    "timeframe": "1H",
    "reason": "Manual test",
    "strategy": "Test Strategy"
  }'
```

## 🔍 **Troubleshooting Specific Errors**

### **Error: "Invalid JSON format"**

- ❌ Check for missing quotes, commas, braces
- ✅ Use jsonlint.com to validate
- ✅ Copy exact format from documentation

### **Error: "Missing required field: symbol"**

- ❌ Field name tidak ada quotes: `symbol` ❌
- ✅ Field name ada quotes: `"symbol"` ✅
- ❌ Typo dalam field name: `"symbl"` ❌
- ✅ Exact field name: `"symbol"` ✅

### **Error: "Invalid price value"**

- ❌ Non-numeric value: `"price": "abc"`
- ✅ Numeric string: `"price": "2650.50"`
- ✅ Number: `"price": 2650.50`

### **Error: "Only XAUUSD signals are supported"**

- ❌ Wrong symbol: `"symbol": "EURUSD"`
- ✅ Correct symbol: `"symbol": "XAUUSD"`

## ✅ **Final Checklist**

Before going live:

1. **✅ JSON Format Valid**

   - Test di jsonlint.com
   - All quotes, commas, braces correct

2. **✅ Required Fields Present**

   - `"symbol": "XAUUSD"`
   - `"action": "BUY"`
   - `"price": "2650.50"`

3. **✅ Test Endpoint Success**

   - `/api/test-zapier` returns success
   - No errors in response

4. **✅ Production URL Updated**

   - Change back to `/api/webhook`
   - Turn on Zap

5. **✅ End-to-End Test**
   - Send email to Zapier
   - Check Telegram notification
   - Verify signal in dashboard

## 🚀 **Expected Success Flow**

```
1. TradingView → Email Alert
2. Email → Zapier Robot Email
3. Zapier → Parse Email
4. Zapier → Send JSON to /api/webhook
5. Bot → Validate JSON
6. Bot → Send to Telegram
7. User → Receive Notification ✅
```

Setelah mengikuti guide ini, Zapier webhook akan bekerja dengan sempurna! 🎉
