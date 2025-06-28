/**
 * Manual Signal Input API
 * POST /api/manual-signal
 *
 * This endpoint allows users to manually input trading signals
 * from any platform (mobile apps, other trading platforms, etc.)
 */

import crypto from "crypto";

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate manual signal input
    const signal = validateManualSignal(body);
    if (!signal.isValid) {
      return Response.json({ error: signal.error }, { status: 400 });
    }

    // Add metadata for manual signals
    const manualSignal = {
      ...signal.data,
      source: "manual",
      inputMethod: "dashboard",
      userId: body.userId || "anonymous",
    };

    // In a real app, save to database (Supabase)
    // For now, using the same storage as webhook signals
    const { signals } = await import("../webhook/route.js");
    signals.push(manualSignal);

    // Send to Telegram
    const telegramResult = await sendTelegramNotification(manualSignal);

    if (!telegramResult.success) {
      console.error(
        "Failed to send Telegram notification:",
        telegramResult.error
      );
      return Response.json(
        { error: "Signal saved but failed to send notification" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Manual signal processed and sent to Telegram",
      signalId: manualSignal.id,
      signal: manualSignal,
    });
  } catch (error) {
    console.error("Manual signal error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET endpoint to retrieve signal input form
 */
export async function GET() {
  const formHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>XAUUSD Manual Signal Input</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
        button:hover { background: #0056b3; }
        .success { color: green; margin-top: 10px; }
        .error { color: red; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>🥇 XAUUSD Signal Input</h1>
    <p>Manually input trading signals for XAUUSD</p>
    
    <form id="signalForm">
        <div class="form-group">
            <label for="action">Action *</label>
            <select id="action" required>
                <option value="">Select Action</option>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
                <option value="CLOSE">CLOSE</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="price">Entry Price *</label>
            <input type="number" id="price" step="0.01" placeholder="2650.50" required>
        </div>
        
        <div class="form-group">
            <label for="stopLoss">Stop Loss</label>
            <input type="number" id="stopLoss" step="0.01" placeholder="2645.00">
        </div>
        
        <div class="form-group">
            <label for="takeProfit">Take Profit</label>
            <input type="number" id="takeProfit" step="0.01" placeholder="2660.00">
        </div>
        
        <div class="form-group">
            <label for="timeframe">Timeframe</label>
            <select id="timeframe">
                <option value="1M">1 Minute</option>
                <option value="5M">5 Minutes</option>
                <option value="15M">15 Minutes</option>
                <option value="30M">30 Minutes</option>
                <option value="1H" selected>1 Hour</option>
                <option value="4H">4 Hours</option>
                <option value="1D">1 Day</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="reason">Analysis/Reason</label>
            <textarea id="reason" rows="3" placeholder="Technical analysis or reason for the trade"></textarea>
        </div>
        
        <div class="form-group">
            <label for="strategy">Strategy Name</label>
            <input type="text" id="strategy" placeholder="Manual Entry" value="Manual Entry">
        </div>
        
        <button type="submit">📤 Send Signal</button>
    </form>
    
    <div id="result"></div>
    
    <script>
        document.getElementById('signalForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                symbol: "XAUUSD",
                action: document.getElementById('action').value,
                price: parseFloat(document.getElementById('price').value),
                stop_loss: document.getElementById('stopLoss').value ? parseFloat(document.getElementById('stopLoss').value) : null,
                take_profit: document.getElementById('takeProfit').value ? parseFloat(document.getElementById('takeProfit').value) : null,
                timeframe: document.getElementById('timeframe').value,
                reason: document.getElementById('reason').value,
                strategy: document.getElementById('strategy').value || "Manual Entry"
            };
            
            try {
                const response = await fetch('/api/manual-signal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                const resultDiv = document.getElementById('result');
                
                if (response.ok) {
                    resultDiv.innerHTML = '<div class="success">✅ Signal sent successfully! Check your Telegram.</div>';
                    document.getElementById('signalForm').reset();
                } else {
                    resultDiv.innerHTML = '<div class="error">❌ Error: ' + result.error + '</div>';
                }
            } catch (error) {
                document.getElementById('result').innerHTML = '<div class="error">❌ Error: ' + error.message + '</div>';
            }
        });
    </script>
</body>
</html>`;

  return new Response(formHTML, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

/**
 * Validate manual signal input
 */
function validateManualSignal(data) {
  const required = ["action", "price"];

  for (const field of required) {
    if (!data[field]) {
      return { isValid: false, error: `Missing required field: ${field}` };
    }
  }

  // Validate action
  const validActions = ["BUY", "SELL", "CLOSE"];
  if (!validActions.includes(data.action?.toUpperCase())) {
    return {
      isValid: false,
      error: "Invalid action. Must be BUY, SELL, or CLOSE",
    };
  }

  // Validate price
  const price = parseFloat(data.price);
  if (isNaN(price) || price <= 0) {
    return { isValid: false, error: "Invalid price value" };
  }

  // Validate stop loss and take profit if provided
  if (data.stop_loss) {
    const stopLoss = parseFloat(data.stop_loss);
    if (isNaN(stopLoss) || stopLoss <= 0) {
      return { isValid: false, error: "Invalid stop loss value" };
    }
  }

  if (data.take_profit) {
    const takeProfit = parseFloat(data.take_profit);
    if (isNaN(takeProfit) || takeProfit <= 0) {
      return { isValid: false, error: "Invalid take profit value" };
    }
  }

  return {
    isValid: true,
    data: {
      id: Date.now().toString() + "_manual",
      symbol: "XAUUSD", // Force XAUUSD
      action: data.action.toUpperCase(),
      price: price,
      stopLoss: data.stop_loss ? parseFloat(data.stop_loss) : null,
      takeProfit: data.take_profit ? parseFloat(data.take_profit) : null,
      timestamp: new Date().toISOString(),
      timeframe: data.timeframe || "1H",
      reason: data.reason || "",
      strategy: data.strategy || "Manual Entry",
    },
  };
}

/**
 * Send notification to Telegram
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
 * Format message for Telegram
 */
function formatTelegramMessage(signal) {
  const emoji =
    signal.action === "BUY" ? "🟢" : signal.action === "SELL" ? "🔴" : "⚪";

  let message = `${emoji} <b>XAUUSD Manual Signal</b> ${emoji}\n\n`;
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
    message += `📝 <b>Analysis:</b> ${signal.reason}\n`;
  }

  message += `🤖 <b>Strategy:</b> ${signal.strategy}\n`;
  message += `📱 <b>Source:</b> Manual Input\n`;
  message += `\n#XAUUSD #ManualSignal #${signal.action}`;

  return message;
}
