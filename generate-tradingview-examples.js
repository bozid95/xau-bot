// Script untuk generate contoh webhook TradingView
// Run dengan: node generate-tradingview-examples.js

console.log("📈 TradingView Webhook JSON Examples\n");
console.log("Copy salah satu format di bawah ke TradingView Alert Message:\n");

const examples = [
  {
    title: "🟢 BASIC BUY SIGNAL",
    description: "Format dasar untuk sinyal BUY",
    json: {
      symbol: "XAUUSD",
      action: "BUY",
      price: "{{close}}",
      stop_loss: "{{close}} - 20",
      take_profit: "{{close}} + 40",
      timeframe: "{{interval}}",
      reason: "Buy signal triggered on {{interval}} timeframe",
      strategy: "TradingView Alert",
    },
  },
  {
    title: "🔴 BASIC SELL SIGNAL",
    description: "Format dasar untuk sinyal SELL",
    json: {
      symbol: "XAUUSD",
      action: "SELL",
      price: "{{close}}",
      stop_loss: "{{close}} + 20",
      take_profit: "{{close}} - 40",
      timeframe: "{{interval}}",
      reason: "Sell signal triggered on {{interval}} timeframe",
      strategy: "TradingView Alert",
    },
  },
  {
    title: "📊 MOVING AVERAGE CROSSOVER",
    description: "Untuk alert moving average cross",
    json: {
      symbol: "XAUUSD",
      action: "{{strategy.order.action}}",
      price: "{{close}}",
      stop_loss: "{{close}} - 25",
      take_profit: "{{close}} + 50",
      timeframe: "{{interval}}",
      reason: "Moving Average crossover signal",
      strategy: "MA Cross Strategy",
    },
  },
  {
    title: "📈 RSI OVERBOUGHT/OVERSOLD",
    description: "Untuk alert RSI levels",
    json: {
      symbol: "XAUUSD",
      action: "BUY",
      price: "{{close}}",
      stop_loss: "{{close}} - 15",
      take_profit: "{{close}} + 30",
      timeframe: "{{interval}}",
      reason: "RSI oversold condition",
      strategy: "RSI Reversal",
      rsi_value: "{{plot_0}}",
    },
  },
  {
    title: "🎯 SUPPORT/RESISTANCE BREAKOUT",
    description: "Untuk alert breakout level",
    json: {
      symbol: "XAUUSD",
      action: "BUY",
      price: "{{close}}",
      stop_loss: 2030,
      take_profit: 2080,
      timeframe: "{{interval}}",
      reason: "Resistance breakout confirmed",
      strategy: "Breakout Strategy",
      breakout_level: 2050,
    },
  },
  {
    title: "⚪ CLOSE POSITION",
    description: "Untuk menutup posisi yang ada",
    json: {
      symbol: "XAUUSD",
      action: "CLOSE",
      price: "{{close}}",
      timeframe: "{{interval}}",
      reason: "Exit condition met",
      strategy: "Exit Strategy",
    },
  },
  {
    title: "🔥 ADVANCED WITH RISK MANAGEMENT",
    description: "Format advanced dengan risk management",
    json: {
      symbol: "XAUUSD",
      action: "BUY",
      price: "{{close}}",
      stop_loss: "{{close}} - 20",
      take_profit: "{{close}} + 40",
      take_profit_2: "{{close}} + 60",
      position_size: 0.1,
      risk_percent: 2,
      timeframe: "{{interval}}",
      reason: "High probability setup",
      strategy: "Advanced Strategy",
      confidence: 85,
      timestamp: "{{time}}",
    },
  },
];

examples.forEach((example, index) => {
  console.log(`${index + 1}. ${example.title}`);
  console.log(`   ${example.description}\n`);
  console.log("```json");
  console.log(JSON.stringify(example.json, null, 2));
  console.log("```\n");
  console.log("─".repeat(60) + "\n");
});

console.log("💡 TIPS PENGGUNAAN:");
console.log("1. Copy JSON format yang sesuai ke TradingView Alert Message");
console.log(
  "2. Variabel {{close}}, {{interval}}, {{time}} akan otomatis diganti"
);
console.log("3. Untuk strategy alerts, gunakan {{strategy.order.action}}");
console.log(
  '4. Test dengan frequency "All" dulu, lalu ubah ke "Once Per Bar Close"'
);
console.log(
  "5. Pastikan webhook URL sudah benar: https://your-domain.vercel.app/api/webhook\n"
);

console.log("🚀 QUICK START:");
console.log("1. Deploy bot ke Vercel");
console.log("2. Buat alert di TradingView");
console.log("3. Set webhook URL dan copy JSON format");
console.log("4. Test alert dan monitor di dashboard");

console.log("\n📚 Dokumentasi lengkap: TRADINGVIEW_CONNECTION.md");
