"use client";

import { useState, useEffect } from "react";

export default function Monitor() {
  const [activeTab, setActiveTab] = useState("signals");
  const [signals, setSignals] = useState([]);
  const [stats, setStats] = useState({
    totalSignals: 0,
    todaySignals: 0,
    lastSignalTime: null,
    botStatus: "offline",
  });

  const [status, setStatus] = useState({
    telegram: { connected: false, lastTest: null, error: null },
    webhook: { active: false, lastReceived: null, totalReceived: 0 },
    deployment: { url: null, isDeployed: false },
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState("all");
  const [testing, setTesting] = useState({ telegram: false, webhook: false });

  useEffect(() => {
    fetchData();

    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchData = async () => {
    try {
      let signalsData = { signals: [] };

      // Fetch signals
      const signalsResponse = await fetch("/api/signals");
      if (signalsResponse.ok) {
        signalsData = await signalsResponse.json();
        setSignals(signalsData.signals || []);
      }

      // Fetch stats
      const statsResponse = await fetch("/api/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Check deployment status
      const deploymentUrl =
        typeof window !== "undefined" ? window.location.origin : null;
      const isDeployed = deploymentUrl && !deploymentUrl.includes("localhost");

      setStatus((prev) => ({
        ...prev,
        deployment: { url: deploymentUrl, isDeployed },
        webhook: {
          ...prev.webhook,
          active: true,
          totalReceived: signalsData.signals?.length || 0,
          lastReceived:
            signalsData.signals?.length > 0
              ? signalsData.signals[0]?.timestamp
              : null,
        },
      }));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const filteredSignals = signals.filter((signal) => {
    if (filter === "all") return true;
    return signal.action.toLowerCase() === filter.toLowerCase();
  });

  const testTelegram = async () => {
    setTesting((prev) => ({ ...prev, telegram: true }));

    try {
      const response = await fetch("/api/test-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "🧪 Monitor test from XAUUSD Trading Bot",
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
        alert("✅ Telegram test successful!");
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
        reason: "Monitor test signal",
        strategy: "Monitor Test",
      };

      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        fetchData(); // Refresh data
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

  const getActionColor = (action) => {
    switch (action) {
      case "BUY":
        return "text-green-600 bg-green-100";
      case "SELL":
        return "text-red-600 bg-red-100";
      case "CLOSE":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getActionEmoji = (action) => {
    switch (action) {
      case "BUY":
        return "🟢";
      case "SELL":
        return "🔴";
      case "CLOSE":
        return "⚪";
      default:
        return "⚫";
    }
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          📺 Monitor & Status
        </h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            Auto Refresh
          </label>
          <button
            onClick={fetchData}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-sm font-medium">Total Signals</div>
          <div className="text-2xl font-bold text-blue-800">
            {stats.totalSignals}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 text-sm font-medium">
            Today&apos;s Signals
          </div>
          <div className="text-2xl font-bold text-green-800">
            {stats.todaySignals}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-purple-600 text-sm font-medium">Bot Status</div>
          <div className="text-2xl font-bold text-purple-800">
            {status.telegram.connected ? "Online" : "Offline"}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-gray-600 text-sm font-medium">Last Signal</div>
          <div className="text-lg font-bold text-gray-800">
            {signals.length > 0
              ? new Date(signals[0].timestamp).toLocaleTimeString()
              : "None"}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("signals")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "signals"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📊 Live Signals
        </button>
        <button
          onClick={() => setActiveTab("status")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "status"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          🔗 Connection Status
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "signals" && (
        <div className="space-y-6">
          {/* Signal Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Filter:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Signals</option>
                <option value="buy">Buy Only</option>
                <option value="sell">Sell Only</option>
                <option value="close">Close Only</option>
              </select>
            </div>
            <button
              onClick={testWebhook}
              disabled={testing.webhook}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-300 transition-colors text-sm"
            >
              {testing.webhook ? "🧪 Testing..." : "🧪 Test Signal"}
            </button>
          </div>

          {/* Signals List */}
          <div className="space-y-3">
            {filteredSignals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-lg mb-2">No signals found</p>
                <p className="text-sm">
                  Signals will appear here as they are received
                </p>
              </div>
            ) : (
              filteredSignals.slice(0, 10).map((signal, index) => (
                <div
                  key={signal.id || index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getActionEmoji(signal.action)}
                      </span>
                      <div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                            signal.action
                          )}`}
                        >
                          {signal.action}
                        </span>
                        <span className="ml-2 font-semibold text-gray-800">
                          {signal.symbol}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {formatTime(signal.timestamp)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Entry Price</div>
                      <div className="font-semibold">
                        ${signal.price.toFixed(2)}
                      </div>
                    </div>
                    {signal.stopLoss && (
                      <div>
                        <div className="text-gray-500">Stop Loss</div>
                        <div className="font-semibold text-red-600">
                          ${signal.stopLoss.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {signal.takeProfit && (
                      <div>
                        <div className="text-gray-500">Take Profit</div>
                        <div className="font-semibold text-green-600">
                          ${signal.takeProfit.toFixed(2)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-gray-500">Timeframe</div>
                      <div className="font-semibold">{signal.timeframe}</div>
                    </div>
                  </div>

                  {signal.reason && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <div className="text-gray-500 text-sm">Analysis</div>
                      <div className="text-sm">{signal.reason}</div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Strategy: {signal.strategy}
                    </div>
                    <div className="text-sm text-gray-500">
                      Source: {signal.source || "TradingView"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Live Status */}
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  autoRefresh ? "bg-green-400 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                {autoRefresh
                  ? "Live monitoring active"
                  : "Live monitoring paused"}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {activeTab === "status" && (
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
                <span className="text-gray-500">Webhook Ready:</span>
                <span
                  className={
                    status.deployment.isDeployed
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {status.deployment.isDeployed ? "Yes" : "No"}
                </span>
              </div>
            </div>
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
              disabled={testing.telegram}
              className={`w-full px-3 py-2 rounded transition-colors text-sm ${
                testing.telegram
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {testing.telegram ? "🧪 Testing..." : "🧪 Test Telegram"}
            </button>
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
                <span className="text-gray-500">Total Signals:</span>
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
              {testing.webhook ? "🧪 Testing..." : "🧪 Test Webhook"}
            </button>
          </div>

          {/* System Overview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-4">
              📊 System Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded border">
                <div
                  className={`text-3xl mb-2 ${
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
                    ? "Production Ready"
                    : "Local Development"}
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div
                  className={`text-3xl mb-2 ${
                    status.telegram.connected
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {status.telegram.connected ? "🟢" : "🔴"}
                </div>
                <div className="text-sm font-medium">Telegram</div>
                <div className="text-xs text-gray-500">
                  {status.telegram.connected
                    ? "Bot Connected"
                    : "Not Connected"}
                </div>
              </div>
              <div className="text-center p-3 bg-white rounded border">
                <div
                  className={`text-3xl mb-2 ${
                    status.webhook.active ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {status.webhook.active ? "🟢" : "🔴"}
                </div>
                <div className="text-sm font-medium">Signals</div>
                <div className="text-xs text-gray-500">
                  {status.webhook.totalReceived} received
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
