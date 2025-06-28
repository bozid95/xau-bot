// Test script untuk testing API endpoints
// Run dengan: node test-api.js

const API_BASE = "http://localhost:3000";

async function testAPI() {
  console.log("🧪 Testing XAUUSD Trading Bot API...\n");

  // Test 1: Stats endpoint
  try {
    console.log("📊 Testing /api/stats...");
    const statsResponse = await fetch(`${API_BASE}/api/stats`);
    const stats = await statsResponse.json();
    console.log("✅ Stats:", stats);
  } catch (error) {
    console.log("❌ Stats test failed:", error.message);
  }

  // Test 2: Signals endpoint
  try {
    console.log("\n📋 Testing /api/signals...");
    const signalsResponse = await fetch(`${API_BASE}/api/signals`);
    const signals = await signalsResponse.json();
    console.log("✅ Signals:", signals);
  } catch (error) {
    console.log("❌ Signals test failed:", error.message);
  }

  // Test 3: Webhook endpoint (dengan data dummy)
  try {
    console.log("\n🔗 Testing /api/webhook...");
    const webhookResponse = await fetch(`${API_BASE}/api/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: "XAUUSD",
        action: "BUY",
        price: 2010.5,
        stop_loss: 1990.5,
        take_profit: 2050.5,
        timeframe: "1H",
        reason: "Test signal from API test",
        strategy: "API Test Strategy",
      }),
    });
    const webhookResult = await webhookResponse.json();
    console.log("✅ Webhook:", webhookResult);
  } catch (error) {
    console.log("❌ Webhook test failed:", error.message);
  }

  // Test 4: Test Telegram endpoint (jika sudah ada konfigurasi)
  try {
    console.log("\n📱 Testing /api/test-telegram...");

    // Check if environment variables exist
    const fs = require("fs");
    let hasConfig = false;

    try {
      const envContent = fs.readFileSync(".env.local", "utf8");
      hasConfig =
        envContent.includes("TELEGRAM_BOT_TOKEN") &&
        envContent.includes("TELEGRAM_CHAT_ID");
    } catch (error) {
      // .env.local file doesn't exist
    }

    if (hasConfig) {
      console.log("   Environment variables found, testing...");
      const telegramResponse = await fetch(`${API_BASE}/api/test-telegram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botToken: process.env.TELEGRAM_BOT_TOKEN,
          chatId: process.env.TELEGRAM_CHAT_ID,
        }),
      });
      const telegramResult = await telegramResponse.json();
      console.log("✅ Telegram test:", telegramResult);
    } else {
      console.log("   ⚠️  No Telegram configuration found in .env.local");
      console.log(
        "   Run `npm run test-telegram` to setup Telegram configuration"
      );
    }
  } catch (error) {
    console.log("❌ Telegram test failed:", error.message);
  }

  // Test 5: Test webhook dengan berbagai format sinyal TradingView
  try {
    console.log("\n🎯 Testing TradingView webhook formats...");

    const tradingViewSignals = [
      {
        name: "Basic BUY Signal",
        data: {
          symbol: "XAUUSD",
          action: "BUY",
          price: 2015.75,
          stop_loss: 1995.75,
          take_profit: 2055.75,
          timeframe: "1H",
          reason: "Golden cross detected",
          strategy: "EMA Cross",
        },
      },
      {
        name: "SELL Signal with RSI",
        data: {
          symbol: "XAUUSD",
          action: "SELL",
          price: 2020.25,
          stop_loss: 2040.25,
          take_profit: 1980.25,
          timeframe: "15m",
          reason: "RSI overbought + resistance",
          strategy: "RSI Reversal",
        },
      },
      {
        name: "CLOSE Position Signal",
        data: {
          symbol: "XAUUSD",
          action: "CLOSE",
          price: 2025.5,
          timeframe: "1H",
          reason: "Take profit reached",
          strategy: "Exit Strategy",
        },
      },
    ];

    for (const signal of tradingViewSignals) {
      console.log(`   Testing: ${signal.name}...`);
      const response = await fetch(`${API_BASE}/api/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signal.data),
      });
      const result = await response.json();

      if (result.success) {
        console.log(`   ✅ ${signal.name}: Success`);
      } else {
        console.log(`   ❌ ${signal.name}: ${result.error}`);
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.log("❌ TradingView webhook test failed:", error.message);
  }

  console.log("\n🎉 API testing completed!");
  console.log("\n💡 Tips:");
  console.log("   - Run `npm run test-telegram` to setup Telegram bot");
  console.log("   - Check dashboard at http://localhost:3000");
  console.log("   - See TELEGRAM_SETUP.md for detailed Telegram setup guide");
}

// Run tests
testAPI();
