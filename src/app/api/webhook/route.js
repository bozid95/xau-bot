import crypto from "crypto";

// Simple in-memory storage untuk demo (dalam production gunakan database)
let signals = [];

/**
 * Webhook endpoint untuk menerima sinyal trading dari TradingView
 * POST /api/webhook
 */
export async function POST(request) {
  try {
    // Debug: Log request details
    console.log("=== WEBHOOK REQUEST DEBUG ===");
    console.log("Headers:", Object.fromEntries(request.headers.entries()));

    const rawBody = await request.text();
    console.log("Raw body:", rawBody);
    console.log("Body length:", rawBody.length);

    let body;
    try {
      body = JSON.parse(rawBody);
      console.log("Parsed JSON:", body);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return Response.json(
        {
          error: "Invalid JSON format",
          received: rawBody,
          details: parseError.message,
          help: "Check Zapier webhook data format",
        },
        { status: 400 }
      );
    }

    // Validasi webhook signature jika diperlukan
    const signature = request.headers.get("x-tradingview-signature");
    if (process.env.TRADINGVIEW_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", process.env.TRADINGVIEW_SECRET)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        return Response.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    // Validasi format sinyal trading
    const signal = validateTradingSignal(body);
    if (!signal.isValid) {
      console.error("Validation failed:", signal.error, "Data:", body);
      return Response.json(
        {
          error: signal.error,
          received_data: body,
          required_fields: ["symbol", "action", "price"],
          zapier_help:
            "Ensure your Zapier webhook data includes: symbol, action, price fields",
        },
        { status: 400 }
      );
    }

    // Simpan signal ke storage
    signals.push(signal.data);

    // Kirim notifikasi ke Telegram
    const telegramResult = await sendTelegramNotification(signal.data);

    if (!telegramResult.success) {
      console.error(
        "Failed to send Telegram notification:",
        telegramResult.error
      );
      return Response.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Signal received and sent to Telegram",
      signalId: signal.data.id,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Validasi format sinyal trading dari TradingView
 */
function validateTradingSignal(data) {
  const required = ["symbol", "action", "price"];

  for (const field of required) {
    if (!data[field]) {
      return { isValid: false, error: `Missing required field: ${field}` };
    }
  }

  // Validasi symbol harus XAUUSD
  if (data.symbol !== "XAUUSD") {
    return { isValid: false, error: "Only XAUUSD signals are supported" };
  }

  // Validasi action
  const validActions = ["BUY", "SELL", "CLOSE"];
  if (!validActions.includes(data.action?.toUpperCase())) {
    return {
      isValid: false,
      error: "Invalid action. Must be BUY, SELL, or CLOSE",
    };
  }

  // Validasi price
  const price = parseFloat(data.price);
  if (isNaN(price) || price <= 0) {
    return { isValid: false, error: "Invalid price value" };
  }

  return {
    isValid: true,
    data: {
      id: Date.now().toString(),
      symbol: data.symbol,
      action: data.action.toUpperCase(),
      price: price,
      stopLoss: data.stop_loss ? parseFloat(data.stop_loss) : null,
      takeProfit: data.take_profit ? parseFloat(data.take_profit) : null,
      timestamp: new Date().toISOString(),
      timeframe: data.timeframe || "1H",
      reason: data.reason || "",
      strategy: data.strategy || "TradingView Alert",
    },
  };
}

/**
 * Kirim notifikasi ke Telegram
 */
async function sendTelegramNotification(signal) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      throw new Error("Telegram configuration missing");
    }

    const message = formatTelegramMessage(signal);

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Format pesan untuk Telegram
 */
function formatTelegramMessage(signal) {
  const emoji =
    signal.action === "BUY" ? "🟢" : signal.action === "SELL" ? "🔴" : "⚪";

  let message = `${emoji} <b>XAUUSD Signal Alert</b> ${emoji}\n\n`;
  message += `📊 <b>Action:</b> ${signal.action}\n`;
  message += `💰 <b>Entry Price:</b> $${signal.price.toFixed(2)}\n`;

  if (signal.stopLoss) {
    message += `🛑 <b>Stop Loss:</b> $${signal.stopLoss.toFixed(2)}\n`;
  }

  if (signal.takeProfit) {
    message += `🎯 <b>Take Profit:</b> $${signal.takeProfit.toFixed(2)}\n`;
  }

  message += `⏰ <b>Time:</b> ${new Date(signal.timestamp).toLocaleString()}\n`;
  message += `📈 <b>Timeframe:</b> ${signal.timeframe}\n`;

  if (signal.reason) {
    message += `📝 <b>Reason:</b> ${signal.reason}\n`;
  }

  message += `🤖 <b>Strategy:</b> ${signal.strategy}\n`;
  message += `\n#XAUUSD #TradingSignal #${signal.action}`;

  return message;
}

/**
 * GET endpoint untuk testing webhook
 */
export async function GET() {
  return Response.json({
    message: "XAUUSD Trading Bot Webhook Endpoint",
    status: "Ready",
    expected_format: {
      symbol: "XAUUSD",
      action: "BUY|SELL|CLOSE",
      price: "number",
      stop_loss: "number (optional)",
      take_profit: "number (optional)",
      timeframe: "string (optional)",
      reason: "string (optional)",
      strategy: "string (optional)",
    },
    zapier_example: {
      symbol: "XAUUSD",
      action: "BUY",
      price: "2650.50",
      stop_loss: "2630.50",
      take_profit: "2680.50",
      timeframe: "1H",
      reason: "Zapier email alert",
      strategy: "Email Bridge",
    },
    test_url: "Send POST request to this endpoint with the above format",
    help: "For Zapier setup, copy the zapier_example JSON to webhook data field",
  });
}

// Export signals untuk digunakan oleh endpoint lain
export { signals };
