# 📱 Panduan Lengkap Setup Telegram Bot

## 🤖 STEP 1: Buat Bot dengan BotFather

### 1.1 Buka BotFather

- Buka Telegram
- Search `@BotFather` atau klik: https://t.me/botfather
- Klik "START"

### 1.2 Buat Bot Baru

Ketik perintah berikut satu per satu:

```
/newbot
```

Bot akan bertanya nama bot:

```
Alright, a new bot. How are we going to call it?
Please choose a name for your bot.
```

Ketik nama bot (contoh):

```
XAUUSD Trading Signals
```

Bot akan bertanya username:

```
Good. Now let's choose a username for your bot.
It must end in `bot`. Like this, for example: TetrisBot or tetris_bot.
```

Ketik username (harus unik dan diakhiri 'bot'):

```
xauusd_trading_signals_bot
```

### 1.3 Dapatkan Token

BotFather akan memberikan response seperti ini:

```
Done! Congratulations on your new bot. You will find it at
t.me/xauusd_trading_signals_bot. You can now add a description,
about section and profile picture for your bot.

Use this token to access the HTTP API:
1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh

Keep your token secure and store it safely, it can be used by
anyone to control your bot.
```

**COPY TOKEN INI** → `1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh`

## 📞 STEP 2: Dapatkan Chat ID

### Method A: Menggunakan @userinfobot (Paling Mudah)

1. **Search @userinfobot** di Telegram atau klik: https://t.me/userinfobot
2. **Klik START**
3. Bot akan mengirim pesan seperti ini:

```
👤 User Info

🆔 ID: 987654321
🏷 First Name: John
🏷 Last Name: Doe
🏷 Username: @johndoe
🌐 Language: en
🤖 Is Bot: No
```

**COPY ID INI** → `987654321`

### Method B: Menggunakan Bot Sendiri

1. **Cari bot Anda** yang baru dibuat (`@xauusd_trading_signals_bot`)
2. **Klik START** dan kirim pesan apa saja (contoh: "Hello")
3. **Buka browser** dan akses URL ini:

   ```
   https://api.telegram.org/bot1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh/getUpdates
   ```

   _(Ganti dengan token bot Anda)_

4. **Cari bagian ini** di response JSON:
   ```json
   {
     "update_id": 123456789,
     "message": {
       "message_id": 1,
       "from": {
         "id": 987654321,    ← CHAT ID ANDA
         "is_bot": false,
         "first_name": "John"
       },
       "chat": {
         "id": 987654321,    ← CHAT ID ANDA
         "first_name": "John",
         "type": "private"
       },
       "date": 1640995200,
       "text": "Hello"
     }
   }
   ```

## 🔧 STEP 3: Test Konfigurasi

### 3.1 Test Manual

Jalankan script test:

```bash
node test-telegram.js
```

Script akan meminta Bot Token dan Chat ID, kemudian mengirim pesan test.

### 3.2 Setup Environment

Buat file `.env.local` dan isi:

```
TELEGRAM_BOT_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh
TELEGRAM_CHAT_ID=987654321
```

### 3.3 Test di Dashboard

1. Jalankan `npm run dev`
2. Buka http://localhost:3000
3. Masukkan Bot Token dan Chat ID di form
4. Klik "Test Connection"
5. Cek Telegram untuk pesan test

## 🚨 Troubleshooting

### Error: "Unauthorized"

- ❌ Bot token salah
- ✅ Copy ulang token dari BotFather

### Error: "Bad Request: chat not found"

- ❌ Chat ID salah
- ✅ Pastikan sudah start conversation dengan bot
- ✅ Gunakan @userinfobot untuk dapatkan Chat ID yang benar

### Error: "Forbidden: bot was blocked by the user"

- ❌ Bot di-block oleh user
- ✅ Unblock bot di Telegram dan coba lagi

### Tidak menerima pesan

- ❌ Belum start conversation dengan bot
- ✅ Kirim pesan "/start" ke bot terlebih dahulu

## 📋 Checklist Setup

- [ ] ✅ Bot dibuat dengan @BotFather
- [ ] ✅ Bot token dicopy dari BotFather
- [ ] ✅ Chat ID didapat dari @userinfobot
- [ ] ✅ Start conversation dengan bot sendiri
- [ ] ✅ Test dengan script `test-telegram.js`
- [ ] ✅ Bot token dan Chat ID masukkan ke `.env.local`
- [ ] ✅ Test di dashboard berhasil
- [ ] ✅ Menerima pesan test di Telegram

## 💡 Tips

### Keamanan

- ❌ Jangan share bot token di public
- ✅ Simpan bot token di environment variables
- ✅ Tambahkan `.env.local` ke `.gitignore`

### Multiple Users

Untuk mengirim ke multiple users/groups:

```
TELEGRAM_CHAT_ID=123456789,987654321,555666777
```

### Group Chat

Untuk group chat:

1. Tambahkan bot ke group
2. Kirim pesan di group
3. Gunakan method B untuk dapatkan group chat ID (biasanya negatif: `-123456789`)

---

Setelah mengikuti panduan ini, bot Telegram Anda siap menerima sinyal trading XAUUSD! 🚀
