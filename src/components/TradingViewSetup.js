"use client";

import { useState, useEffect } from "react";

export default function TradingViewSetup() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isDeployed, setIsDeployed] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [showWebhookPayload, setShowWebhookPayload] = useState(false);
  const [testPayload, setTestPayload] = useState("");

  useEffect(() => {
    // Check if running on deployed URL
    if (typeof window !== "undefined") {
      const currentUrl = window.location.origin;
      if (
        currentUrl.includes("vercel.app") ||
        !currentUrl.includes("localhost")
      ) {
        setIsDeployed(true);
        setDeploymentUrl(currentUrl);
        setWebhookUrl(`${currentUrl}/api/webhook`);
      }
    }
  }, []);

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    alert("Webhook URL copied to clipboard!");
  };

  const examplePayload = {
    symbol: "XAUUSD",
    action: "BUY",
    price: 2650.5,
    stop_loss: 2645.0,
    take_profit: 2660.0,
    timeframe: "1H",
    reason: "Bullish breakout above resistance",
    strategy: "Breakout Strategy",
  };

  const testWebhook = async () => {
    try {
      const payload = testPayload ? JSON.parse(testPayload) : examplePayload;

      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(
          "✅ Test webhook sent successfully! Check your Telegram for the message."
        );
      } else {
        const error = await response.json();
        alert(`❌ Test failed: ${error.error}`);
      }
    } catch (error) {
      alert(`❌ Test failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📈 TradingView Setup
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            isDeployed
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isDeployed ? "🟢 Deployed" : "🔴 Local Dev"}
        </div>
      </div>

      {!isDeployed && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">
            ⚠️ Deployment Required
          </h3>
          <p className="text-red-700 mb-3">
            TradingView webhooks require HTTPS URLs. You need to deploy this bot
            to Vercel or another hosting platform.
          </p>
          <div className="bg-red-100 p-3 rounded text-sm">
            <p className="font-semibold mb-2">Quick Deploy Steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Push your code to GitHub</li>
              <li>Connect GitHub to Vercel</li>
              <li>Add environment variables in Vercel dashboard</li>
              <li>Deploy and get your HTTPS URL</li>
            </ol>
          </div>
        </div>
      )}

      {isDeployed && (
        <div className="space-y-6">
          {/* Webhook URL Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">🔗 Webhook URL</h3>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={webhookUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-blue-300 rounded-md bg-white font-mono text-sm"
              />
              <button
                onClick={copyWebhookUrl}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <p className="text-blue-700 text-sm mt-2">
              Use this URL in your TradingView alerts webhook configuration.
            </p>
          </div>

          {/* TradingView Plan Requirements */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-3">
              💰 TradingView Plan Requirements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-yellow-700">Free Plan</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                  ❌ No Webhooks
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-700">Pro Plan ($14.95/month)</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  ✅ 20 Alerts
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-700">
                  Pro+ Plan ($29.95/month)
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                  ✅ 100 Alerts
                </span>
              </div>
            </div>
            <p className="text-yellow-700 text-sm mt-3">
              <strong>Minimum requirement:</strong> Pro Plan for webhook support
            </p>
          </div>

          {/* Alert Setup Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">
              📝 TradingView Alert Setup
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <div>
                  <p className="font-semibold">Open TradingView Chart</p>
                  <p>Go to XAUUSD chart on TradingView</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <div>
                  <p className="font-semibold">Create Alert</p>
                  <p>Click the alarm icon and set your conditions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <div>
                  <p className="font-semibold">Configure Webhook</p>
                  <p>
                    In alert settings, enable &quot;Webhook URL&quot; and paste
                    the URL above
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <div>
                  <p className="font-semibold">Set Message Format</p>
                  <p>Use the JSON payload format shown below</p>
                </div>
              </div>
            </div>
          </div>

          {/* Webhook Payload Format */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                📄 Webhook Payload Format
              </h3>
              <button
                onClick={() => setShowWebhookPayload(!showWebhookPayload)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {showWebhookPayload ? "Hide" : "Show"} Example
              </button>
            </div>

            {showWebhookPayload && (
              <div className="space-y-3">
                <div className="bg-gray-800 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre>{JSON.stringify(examplePayload, null, 2)}</pre>
                </div>

                <div className="text-sm text-gray-600">
                  <p className="font-semibold mb-2">Required Fields:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <code>symbol</code>: Must be &quot;XAUUSD&quot;
                    </li>
                    <li>
                      <code>action</code>: &quot;BUY&quot;, &quot;SELL&quot;, or
                      &quot;CLOSE&quot;
                    </li>
                    <li>
                      <code>price</code>: Current price (number)
                    </li>
                  </ul>

                  <p className="font-semibold mt-3 mb-2">Optional Fields:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <code>stop_loss</code>: Stop loss price
                    </li>
                    <li>
                      <code>take_profit</code>: Take profit price
                    </li>
                    <li>
                      <code>timeframe</code>: Chart timeframe
                    </li>
                    <li>
                      <code>reason</code>: Trade reason/analysis
                    </li>
                    <li>
                      <code>strategy</code>: Strategy name
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Test Section */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3">
              🧪 Test Webhook
            </h3>
            <div className="space-y-3">
              <textarea
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                placeholder={`Enter custom JSON payload or leave empty to use example:\n\n${JSON.stringify(
                  examplePayload,
                  null,
                  2
                )}`}
                className="w-full h-32 px-3 py-2 border border-green-300 rounded-md text-sm font-mono"
              />
              <button
                onClick={testWebhook}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                🚀 Send Test Signal
              </button>
            </div>
            <p className="text-green-700 text-sm mt-2">
              This will send a test signal to your configured Telegram bot.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
