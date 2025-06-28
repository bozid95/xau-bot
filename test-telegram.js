// Script untuk test Telegram bot token dan chat ID
// Run dengan: node test-telegram.js

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function testTelegramConfig() {
  console.log("🤖 Telegram Bot Configuration Test\n");

  // Get bot token
  const botToken = await new Promise((resolve) => {
    rl.question("📝 Masukkan Bot Token: ", (answer) => {
      resolve(answer.trim());
    });
  });

  // Get chat ID
  const chatId = await new Promise((resolve) => {
    rl.question("📝 Masukkan Chat ID: ", (answer) => {
      resolve(answer.trim());
    });
  });

  console.log("\n🔍 Testing configuration...\n");

  // Test 1: Get bot info
  try {
    console.log("1️⃣ Testing bot token...");
    const botInfoResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    );
    const botInfo = await botInfoResponse.json();

    if (botInfo.ok) {
      console.log("✅ Bot token valid!");
      console.log(`   Bot name: ${botInfo.result.first_name}`);
      console.log(`   Username: @${botInfo.result.username}`);
    } else {
      console.log("❌ Bot token invalid:", botInfo.description);
      rl.close();
      return;
    }
  } catch (error) {
    console.log("❌ Error testing bot token:", error.message);
    rl.close();
    return;
  }

  // Test 2: Send test message
  try {
    console.log("\n2️⃣ Testing chat ID and sending message...");
    const testMessage = `🧪 Test Message from XAUUSD Trading Bot

✅ Configuration successful!
🕐 Time: ${new Date().toLocaleString()}
🤖 Bot is ready to send trading signals!

#TestMessage #XAUUSDBot`;

    const sendResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMessage,
          parse_mode: "HTML",
        }),
      }
    );

    const sendResult = await sendResponse.json();

    if (sendResult.ok) {
      console.log("✅ Test message sent successfully!");
      console.log("📱 Check your Telegram for the test message");

      // Show environment variables format
      console.log("\n📋 Add these to your .env.local file:");
      console.log("TELEGRAM_BOT_TOKEN=" + botToken);
      console.log("TELEGRAM_CHAT_ID=" + chatId);
    } else {
      console.log("❌ Failed to send message:", sendResult.description);
      if (sendResult.error_code === 400) {
        console.log(
          "💡 Tip: Make sure you have started a conversation with your bot first!"
        );
        console.log(
          "   Send any message to your bot on Telegram, then try again."
        );
      }
    }
  } catch (error) {
    console.log("❌ Error sending test message:", error.message);
  }

  rl.close();
}

console.log("=" * 50);
console.log("🥇 XAUUSD Telegram Trading Bot Setup");
console.log("=" * 50);
console.log("\n📚 Quick Guide:");
console.log("1. Create bot with @BotFather");
console.log("2. Get your Chat ID from @userinfobot");
console.log("3. Start conversation with your bot");
console.log("4. Run this test script\n");

testTelegramConfig();
