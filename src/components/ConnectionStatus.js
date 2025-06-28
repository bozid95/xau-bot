"use client";

import { useState, useEffect } from "react";

export default function ConnectionStatus() {
  const [status, setStatus] = useState({
    telegram: { connected: false, lastTest: null, error: null },
    webhook: { active: false, lastReceived: null, totalReceived: 0 },
    deployment: { url: null, isDeployed: false },
  });

  const [testing, setTesting] = useState({
    telegram: false,
    webhook: false,
  });

  const [config, setConfig] = useState({
    botToken: "",
    chatId: "",
  });

  useEffect(() => {
    checkStatus();
    loadConfig();

    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadConfig = () => {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("telegramConfig");
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    }
  };

  const checkStatus = async () => {
    // Check deployment status
    const deploymentUrl =
      typeof window !== "undefined" ? window.location.origin : null;
    const isDeployed = deploymentUrl && !deploymentUrl.includes("localhost");

    // Check webhook status
    try {
      const signalsResponse = await fetch("/api/signals");
      const signalsData = await signalsResponse.json();

      setStatus((prev) => ({
        ...prev,
        deployment: {
          url: deploymentUrl,
          isDeployed,
        },
        webhook: {
          active: true,
          lastReceived:
            signalsData.signals?.length > 0
              ? signalsData.signals[0]?.timestamp
              : null,
          totalReceived: signalsData.signals?.length || 0,
        },
      }));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        webhook: { ...prev.webhook, active: false },
      }));
    }
  };

  const testTelegram = async () => {
    setTesting((prev) => ({ ...prev, telegram: true }));

    try {
      const response = await fetch("/api/test-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "🧪 Connection test from XAUUSD Trading Bot",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus((prev) => ({
          ...prev,
          telegram: {
            connected: true,
            lastTest: new Date().toISOString(),
            error: null,
          },
        }));
        alert(
          "✅ Telegram test successful! Check your Telegram for the test message."
        );
      } else {
        setStatus((prev) => ({
          ...prev,
          telegram: {
            connected: false,
            lastTest: new Date().toISOString(),
            error: result.error,
          },
        }));
        alert(`❌ Telegram test failed: ${result.error}`);
      }
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        telegram: {
          connected: false,
          lastTest: new Date().toISOString(),
          error: error.message,
        },
      }));
      alert(`❌ Telegram test failed: ${error.message}`);
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
        reason: "Webhook connection test",
        strategy: "Connection Test",
      };

      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        setStatus((prev) => ({
          ...prev,
          webhook: {
            ...prev.webhook,
            lastReceived: new Date().toISOString(),
            totalReceived: prev.webhook.totalReceived + 1,
          },
        }));
        alert("✅ Webhook test successful! Signal sent to Telegram.");
      } else {
        const error = await response.json();
        alert(`❌ Webhook test failed: ${error.error}`);
      }
    } catch (error) {
      alert(`❌ Webhook test failed: ${error.message}`);
    } finally {
      setTesting((prev) => ({ ...prev, webhook: false }));
    }
  };

  const copyWebhookUrl = () => {
    const url = `${status.deployment.url}/api/webhook`;
    navigator.clipboard.writeText(url);
    alert("📋 Webhook URL copied to clipboard!");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (isConnected) => {
    return isConnected
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
  };

  const getStatusIcon = (isConnected) => {
    return isConnected ? "🟢" : "🔴";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🔗 Connection Status
        </h2>
        <button
          onClick={checkStatus}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="space-y-6">
        {/* Deployment Status */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              {getStatusIcon(status.deployment.isDeployed)}
              Deployment Status
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                status.deployment.isDeployed
              )}`}
            >
              {status.deployment.isDeployed ? "Deployed" : "Local Dev"}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">URL:</span>
              <span className="font-mono">
                {status.deployment.url || "Not available"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Webhook Endpoint:</span>
              <span className="font-mono">
                {status.deployment.url}/api/webhook
              </span>
            </div>
          </div>

          {status.deployment.isDeployed && (
            <button
              onClick={copyWebhookUrl}
              className="mt-3 w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              📋 Copy Webhook URL
            </button>
          )}

          {!status.deployment.isDeployed && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-700 text-sm">
                ⚠️ Running locally. Deploy to Vercel for TradingView webhook
                support.
              </p>
            </div>
          )}
        </div>

        {/* Telegram Status */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              {getStatusIcon(status.telegram.connected)}
              Telegram Bot
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                status.telegram.connected
              )}`}
            >
              {status.telegram.connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Bot Token:</span>
              <span className="font-mono">
                {config.botToken
                  ? `${config.botToken.substring(0, 10)}...`
                  : "Not configured"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Chat ID:</span>
              <span className="font-mono">
                {config.chatId || "Not configured"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Test:</span>
              <span>{formatTime(status.telegram.lastTest)}</span>
            </div>
          </div>

          {status.telegram.error && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              Error: {status.telegram.error}
            </div>
          )}

          <button
            onClick={testTelegram}
            disabled={testing.telegram || !config.botToken || !config.chatId}
            className={`w-full px-3 py-2 rounded transition-colors text-sm ${
              testing.telegram
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : config.botToken && config.chatId
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {testing.telegram ? "🧪 Testing..." : "🧪 Test Telegram Connection"}
          </button>

          {(!config.botToken || !config.chatId) && (
            <p className="text-yellow-600 text-sm mt-2">
              ⚠️ Configure Telegram credentials in the setup tab first
            </p>
          )}
        </div>

        {/* Webhook Status */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              {getStatusIcon(status.webhook.active)}
              Webhook Endpoint
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                status.webhook.active
              )}`}
            >
              {status.webhook.active ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Signals Received:</span>
              <span className="font-semibold">
                {status.webhook.totalReceived}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Signal:</span>
              <span>{formatTime(status.webhook.lastReceived)}</span>
            </div>
          </div>

          <button
            onClick={testWebhook}
            disabled={testing.webhook}
            className={`w-full px-3 py-2 rounded transition-colors text-sm ${
              testing.webhook
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
          >
            {testing.webhook ? "🧪 Testing..." : "🧪 Test Webhook Endpoint"}
          </button>
        </div>

        {/* Overall Status Summary */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">📊 System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white rounded border">
              <div
                className={`text-2xl mb-1 ${
                  status.deployment.isDeployed
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {status.deployment.isDeployed ? "🟢" : "🔴"}
              </div>
              <div className="text-sm font-medium">Deployment</div>
              <div className="text-xs text-gray-500">
                {status.deployment.isDeployed
                  ? "Ready for webhooks"
                  : "Local only"}
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div
                className={`text-2xl mb-1 ${
                  status.telegram.connected ? "text-green-500" : "text-red-500"
                }`}
              >
                {status.telegram.connected ? "🟢" : "🔴"}
              </div>
              <div className="text-sm font-medium">Telegram</div>
              <div className="text-xs text-gray-500">
                {status.telegram.connected ? "Bot connected" : "Not connected"}
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded border">
              <div
                className={`text-2xl mb-1 ${
                  status.webhook.active ? "text-green-500" : "text-red-500"
                }`}
              >
                {status.webhook.active ? "🟢" : "🔴"}
              </div>
              <div className="text-sm font-medium">Webhook</div>
              <div className="text-xs text-gray-500">
                {status.webhook.totalReceived} signals received
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
