"use client";

import { useState, useEffect } from "react";

export default function BotSetup() {
  const [activeStep, setActiveStep] = useState(0);
  const [config, setConfig] = useState({
    telegram: { botToken: "", chatId: "", isConfigured: false },
    deployment: { url: null, isDeployed: false },
    tradingView: { webhookUrl: "", hasProPlan: false },
    email: { platform: "", isConfigured: false },
  });

  const [testing, setTesting] = useState({
    telegram: false,
    webhook: false,
    email: false,
  });

  const setupSteps = [
    {
      id: "telegram",
      title: "🤖 Telegram Bot",
      description: "Configure your Telegram bot credentials",
      required: true,
    },
    {
      id: "deployment",
      title: "🚀 Deployment",
      description: "Deploy bot to get HTTPS webhook URL",
      required: true,
    },
    {
      id: "signals",
      title: "📈 Signal Source",
      description: "Choose TradingView (Pro) or Email alerts (Free)",
      required: true,
    },
    {
      id: "test",
      title: "🧪 Test & Verify",
      description: "Test all connections and verify setup",
      required: true,
    },
  ];

  useEffect(() => {
    loadConfiguration();
    checkDeploymentStatus();
  }, []);

  const loadConfiguration = () => {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("botSetupConfig");
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    }
  };

  const saveConfiguration = (newConfig) => {
    setConfig(newConfig);
    if (typeof window !== "undefined") {
      localStorage.setItem("botSetupConfig", JSON.stringify(newConfig));
    }
  };

  const checkDeploymentStatus = () => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.origin;
      const isDeployed = !currentUrl.includes("localhost");

      setConfig((prev) => ({
        ...prev,
        deployment: {
          url: currentUrl,
          isDeployed,
        },
        tradingView: {
          ...prev.tradingView,
          webhookUrl: `${currentUrl}/api/webhook`,
        },
      }));
    }
  };

  const testTelegramConnection = async () => {
    setTesting((prev) => ({ ...prev, telegram: true }));

    try {
      const response = await fetch("/api/test-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botToken: config.telegram.botToken,
          chatId: config.telegram.chatId,
          message: "🧪 Bot setup test from XAUUSD Trading Bot",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const newConfig = {
          ...config,
          telegram: { ...config.telegram, isConfigured: true },
        };
        saveConfiguration(newConfig);
        alert(
          "✅ Telegram test successful! Check your Telegram for the message."
        );
      } else {
        alert(`❌ Telegram test failed: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Test failed: ${error.message}`);
    } finally {
      setTesting((prev) => ({ ...prev, telegram: false }));
    }
  };

  const testWebhook = async () => {
    setTesting((prev) => ({ ...prev, webhook: true }));

    try {
      const testPayload = {
        symbol: "XAUUSD",
        action: "BUY",
        price: 2650.5,
        stop_loss: 2645.0,
        take_profit: 2660.0,
        timeframe: "1H",
        reason: "Setup test signal",
        strategy: "Bot Setup Test",
      };

      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        alert("✅ Webhook test successful! Signal sent to Telegram.");
      } else {
        const error = await response.json();
        alert(`❌ Webhook test failed: ${error.error}`);
      }
    } catch (error) {
      alert(`❌ Test failed: ${error.message}`);
    } finally {
      setTesting((prev) => ({ ...prev, webhook: false }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("📋 Copied to clipboard!");
  };

  const getStepStatus = (stepId) => {
    switch (stepId) {
      case "telegram":
        return config.telegram.isConfigured;
      case "deployment":
        return config.deployment.isDeployed;
      case "signals":
        return config.tradingView.hasProPlan || config.email.isConfigured;
      case "test":
        return config.telegram.isConfigured && config.deployment.isDeployed;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const currentStep = setupSteps[activeStep];

    switch (currentStep.id) {
      case "telegram":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                📱 Get Telegram Bot Token
              </h3>
              <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                <li>Open Telegram and search for &quot;@BotFather&quot;</li>
                <li>Send /newbot and follow instructions</li>
                <li>Copy the bot token (looks like: 123456:ABC-DEF...)</li>
                <li>Get your chat ID by messaging @userinfobot</li>
              </ol>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bot Token *
                </label>
                <input
                  type="text"
                  value={config.telegram.botToken}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      telegram: { ...prev.telegram, botToken: e.target.value },
                    }))
                  }
                  placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chat ID *
                </label>
                <input
                  type="text"
                  value={config.telegram.chatId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      telegram: { ...prev.telegram, chatId: e.target.value },
                    }))
                  }
                  placeholder="123456789 or @yourchannel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                onClick={testTelegramConnection}
                disabled={
                  testing.telegram ||
                  !config.telegram.botToken ||
                  !config.telegram.chatId
                }
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  testing.telegram
                    ? "bg-gray-300 text-gray-500"
                    : config.telegram.botToken && config.telegram.chatId
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {testing.telegram ? "🧪 Testing..." : "🧪 Test Connection"}
              </button>
            </div>
          </div>
        );

      case "deployment":
        return (
          <div className="space-y-6">
            <div
              className={`border rounded-lg p-4 ${
                config.deployment.isDeployed
                  ? "bg-green-50 border-green-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <h3
                className={`font-semibold mb-2 ${
                  config.deployment.isDeployed
                    ? "text-green-800"
                    : "text-yellow-800"
                }`}
              >
                {config.deployment.isDeployed
                  ? "✅ Deployed"
                  : "⚠️ Local Development"}
              </h3>
              <p
                className={`text-sm ${
                  config.deployment.isDeployed
                    ? "text-green-700"
                    : "text-yellow-700"
                }`}
              >
                Current URL:{" "}
                <code className="bg-white px-2 py-1 rounded">
                  {config.deployment.url}
                </code>
              </p>
            </div>

            {!config.deployment.isDeployed && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">
                  🚀 Deploy to Vercel (Free)
                </h3>
                <div className="space-y-3 text-sm text-blue-700">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-semibold">Push to GitHub</p>
                      <div className="bg-gray-800 text-green-400 p-2 rounded font-mono text-xs mt-1">
                        git init
                        <br />
                        git add .<br />
                        git commit -m &quot;XAUUSD Bot&quot;
                        <br />
                        git push origin main
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-semibold">Deploy on Vercel</p>
                      <p>Go to vercel.com → New Project → Import from GitHub</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-semibold">Add Environment Variables</p>
                      <p>TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {config.deployment.isDeployed && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">
                  🎯 Webhook URL Ready
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={config.tradingView.webhookUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-green-300 rounded bg-white font-mono text-sm"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(config.tradingView.webhookUrl)
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case "signals":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TradingView Pro Option */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📈</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      TradingView Pro
                    </h3>
                    <p className="text-sm text-gray-600">
                      $14.95/month - 20 alerts
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-green-600">✅ Advantages:</p>
                    <ul className="text-gray-600 ml-4">
                      <li>• Direct webhook integration</li>
                      <li>• Real-time alerts</li>
                      <li>• 20 active alerts</li>
                      <li>• Advanced indicators</li>
                    </ul>
                  </div>

                  {config.deployment.isDeployed && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        Setup Instructions:
                      </p>
                      <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                        <li>Create alert on TradingView</li>
                        <li>Enable &quot;Webhook URL&quot;</li>
                        <li>
                          Paste:{" "}
                          <code className="bg-white px-1">
                            {config.tradingView.webhookUrl}
                          </code>
                        </li>
                        <li>Use JSON format in message</li>
                      </ol>
                    </div>
                  )}

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.tradingView.hasProPlan}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          tradingView: {
                            ...prev.tradingView,
                            hasProPlan: e.target.checked,
                          },
                        }))
                      }
                    />
                    <span className="text-sm">I have TradingView Pro plan</span>
                  </label>
                </div>
              </div>

              {/* Email Bridge Option */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Email Bridge
                    </h3>
                    <p className="text-sm text-gray-600">
                      Free - Unlimited alerts
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-green-600">✅ Advantages:</p>
                    <ul className="text-gray-600 ml-4">
                      <li>• Works with free TradingView</li>
                      <li>• Unlimited alerts</li>
                      <li>• Email automation (Zapier/IFTTT)</li>
                      <li>• No monthly fees</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Platform:
                    </label>
                    <select
                      value={config.email.platform}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          email: {
                            ...prev.email,
                            platform: e.target.value,
                            isConfigured: e.target.value !== "",
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Select Platform</option>
                      <option value="zapier">Zapier (Recommended)</option>
                      <option value="ifttt">IFTTT</option>
                      <option value="powerautomate">Power Automate</option>
                    </select>
                  </div>

                  {config.email.platform === "zapier" && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        🔗 Zapier Setup (Detailed):
                      </p>
                      <div className="space-y-2 text-xs text-blue-700">
                        <div className="bg-white p-2 rounded border border-blue-200">
                          <p className="font-semibold">Step 1: Create Zap</p>
                          <ol className="list-decimal list-inside ml-2">
                            <li>
                              Go to{" "}
                              <a
                                href="https://zapier.com"
                                target="_blank"
                                className="underline"
                              >
                                zapier.com
                              </a>{" "}
                              → Create Zap
                            </li>
                            <li>
                              Trigger: &quot;Email by Zapier&quot; → &quot;New
                              Inbound Email&quot;
                            </li>
                            <li>
                              Copy the robot email (like: abc@robot.zapier.com)
                            </li>
                          </ol>
                        </div>
                        <div className="bg-white p-2 rounded border border-blue-200">
                          <p className="font-semibold">Step 2: Setup Action</p>
                          <ol className="list-decimal list-inside ml-2">
                            <li>
                              Action: &quot;Webhooks by Zapier&quot; →
                              &quot;POST&quot;
                            </li>
                            <li>
                              URL:{" "}
                              <code className="bg-gray-100 px-1">
                                {config.tradingView.webhookUrl}
                              </code>
                            </li>
                            <li>Payload Type: JSON</li>
                            <li>Data: Copy exact JSON format below</li>
                          </ol>
                        </div>
                        <div className="bg-white p-2 rounded border border-blue-200">
                          <p className="font-semibold">
                            JSON Data Format (Copy This):
                          </p>
                          <div className="relative">
                            <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs overflow-x-auto mt-1">{`{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": "2650.50",
  "stop_loss": "2630.50",
  "take_profit": "2680.50",
  "timeframe": "1H",
  "reason": "Email alert",
  "strategy": "Email Bridge"
}`}</pre>
                            <button
                              onClick={() =>
                                copyToClipboard(`{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": "2650.50",
  "stop_loss": "2630.50",
  "take_profit": "2680.50",
  "timeframe": "1H",
  "reason": "Email alert",
  "strategy": "Email Bridge"
}`)
                              }
                              className="absolute top-1 right-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                            >
                              📋
                            </button>
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border border-blue-200">
                          <p className="font-semibold">
                            Step 3: TradingView Setup
                          </p>
                          <ol className="list-decimal list-inside ml-2">
                            <li>Create TradingView alert</li>
                            <li>Enable &quot;Send email&quot;</li>
                            <li>Use Zapier robot email as recipient</li>
                            <li>Format email with signal data</li>
                          </ol>
                        </div>
                        <div className="bg-white p-2 rounded border border-blue-200">
                          <p className="font-semibold">JSON Payload Example:</p>
                          <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs overflow-x-auto mt-1">{`{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": "{{email.subject}}",
  "source": "zapier",
  "email_body": "{{email.body}}"
}`}</pre>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded border border-yellow-300">
                          <p className="font-semibold text-yellow-800">
                            💡 Pro Tips:
                          </p>
                          <ul className="text-yellow-700 ml-2">
                            <li>• Use specific email subjects for parsing</li>
                            <li>• Add Formatter step for advanced parsing</li>
                            <li>• Test with simple alerts first</li>
                            <li>• Monitor Zap history for troubleshooting</li>
                          </ul>
                        </div>
                        <div className="bg-red-50 p-2 rounded border border-red-200">
                          <p className="font-semibold text-red-800">
                            🚨 Common Error: &quot;Missing required field:
                            symbol&quot;
                          </p>
                          <div className="text-red-700 text-xs mt-1">
                            <p className="font-medium">Quick Fix:</p>
                            <ol className="list-decimal list-inside ml-2">
                              <li>
                                Use test URL first:{" "}
                                <code className="bg-white px-1">
                                  {config.tradingView.webhookUrl.replace(
                                    "/api/webhook",
                                    "/api/test-zapier"
                                  )}
                                </code>
                              </li>
                              <li>Copy exact JSON format above</li>
                              <li>Test action in Zapier</li>
                              <li>Check response for debugging</li>
                              <li>Fix issues, then use production URL</li>
                            </ol>
                          </div>
                        </div>
                        <div className="text-center mt-2 space-y-1">
                          <a
                            href="/ZAPIER_ERROR_FIX.md"
                            target="_blank"
                            className="block text-blue-600 underline font-semibold text-sm"
                          >
                            📖 Complete Zapier Error Fix Guide
                          </a>
                          <a
                            href="/ZAPIER_SETUP_GUIDE.md"
                            target="_blank"
                            className="block text-blue-600 underline font-semibold text-sm"
                          >
                            📚 Full Zapier Setup Documentation
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {config.email.platform === "ifttt" && (
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm font-medium text-green-800 mb-2">
                        🔗 IFTTT Setup:
                      </p>
                      <ol className="text-xs text-green-700 space-y-1 list-decimal list-inside">
                        <li>
                          Go to{" "}
                          <a
                            href="https://ifttt.com"
                            target="_blank"
                            className="underline"
                          >
                            ifttt.com
                          </a>
                        </li>
                        <li>
                          Create &quot;Gmail&quot; → &quot;Webhooks&quot; applet
                        </li>
                        <li>Set trigger: &quot;New email in inbox&quot;</li>
                        <li>Set action: &quot;Make a web request&quot;</li>
                        <li>Configure webhook with email data</li>
                      </ol>
                    </div>
                  )}

                  {config.email.platform === "powerautomate" && (
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-sm font-medium text-purple-800 mb-2">
                        🔗 Power Automate Setup:
                      </p>
                      <ol className="text-xs text-purple-700 space-y-1 list-decimal list-inside">
                        <li>
                          Go to{" "}
                          <a
                            href="https://powerautomate.microsoft.com"
                            target="_blank"
                            className="underline"
                          >
                            powerautomate.microsoft.com
                          </a>
                        </li>
                        <li>
                          Create flow: &quot;When new email arrives&quot; →
                          &quot;HTTP POST&quot;
                        </li>
                        <li>Set email filter for TradingView alerts</li>
                        <li>Configure HTTP action to webhook URL</li>
                        <li>Map email content to JSON payload</li>
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* JSON Format Examples */}
            {(config.tradingView.hasProPlan || config.email.platform) && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  📝 Message Format
                </h3>
                <div className="bg-gray-800 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre>{`{
  "symbol": "XAUUSD",
  "action": "BUY",
  "price": {{close}},
  "stop_loss": {{close}} - 20,
  "take_profit": {{close}} + 40,
  "timeframe": "{{interval}}",
  "reason": "Alert triggered",
  "strategy": "TradingView Alert"
}`}</pre>
                </div>
              </div>
            )}
          </div>
        );

      case "test":
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">
                🧪 Final Testing
              </h3>
              <p className="text-green-700 text-sm mb-4">
                Test all components to ensure everything is working correctly.
              </p>
            </div>

            <div className="space-y-4">
              {/* Test Telegram */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">🤖 Telegram Connection</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      config.telegram.isConfigured
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {config.telegram.isConfigured
                      ? "Connected"
                      : "Not Connected"}
                  </span>
                </div>
                <button
                  onClick={testTelegramConnection}
                  disabled={testing.telegram}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {testing.telegram ? "Testing..." : "Test Telegram"}
                </button>
              </div>

              {/* Test Webhook */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">📈 Webhook Endpoint</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      config.deployment.isDeployed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {config.deployment.isDeployed ? "Ready" : "Not Deployed"}
                  </span>
                </div>
                <button
                  onClick={testWebhook}
                  disabled={testing.webhook || !config.deployment.isDeployed}
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-300"
                >
                  {testing.webhook ? "Testing..." : "Test Webhook"}
                </button>
              </div>

              {/* Overall Status */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">📊 Setup Status</h4>
                <div className="space-y-2">
                  {setupSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{step.title}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          getStepStatus(step.id)
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getStepStatus(step.id)
                          ? "✅ Complete"
                          : "❌ Incomplete"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">🛠️ Bot Setup</h2>
        <div className="text-sm text-gray-500">
          Step {activeStep + 1} of {setupSteps.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {setupSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold cursor-pointer transition-colors ${
                index <= activeStep
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500"
              } ${getStepStatus(step.id) ? "ring-2 ring-green-500" : ""}`}
              onClick={() => setActiveStep(index)}
            >
              {getStepStatus(step.id) ? "✅" : index + 1}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((activeStep + 1) / setupSteps.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {setupSteps[activeStep].title}
          </h3>
          <p className="text-gray-600">{setupSteps[activeStep].description}</p>
        </div>

        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className={`px-6 py-2 rounded-md transition-colors ${
            activeStep === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-500 text-white hover:bg-gray-600"
          }`}
        >
          ← Previous
        </button>
        <button
          onClick={() =>
            setActiveStep(Math.min(setupSteps.length - 1, activeStep + 1))
          }
          disabled={activeStep === setupSteps.length - 1}
          className={`px-6 py-2 rounded-md transition-colors ${
            activeStep === setupSteps.length - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
