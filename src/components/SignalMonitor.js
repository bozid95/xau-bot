"use client";

import { useState, useEffect } from "react";

export default function SignalMonitor() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchSignals();

    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchSignals, 5000); // Refresh every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchSignals = async () => {
    try {
      const response = await fetch("/api/signals");
      if (response.ok) {
        const data = await response.json();
        setSignals(data.signals || []);
      }
    } catch (error) {
      console.error("Failed to fetch signals:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSignals = signals.filter((signal) => {
    if (filter === "all") return true;
    return signal.action.toLowerCase() === filter.toLowerCase();
  });

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
    return new Date(timestamp).toLocaleString();
  };

  const calculatePnL = (signal) => {
    // This is a simplified P&L calculation for demonstration
    // In a real system, you'd track entry/exit prices
    if (signal.action === "CLOSE") return 0;

    const currentPrice = 2650; // This would come from a real price feed
    const entryPrice = signal.price;

    if (signal.action === "BUY") {
      return currentPrice - entryPrice;
    } else {
      return entryPrice - currentPrice;
    }
  };

  const generateTestSignal = async () => {
    const testSignal = {
      symbol: "XAUUSD",
      action: Math.random() > 0.5 ? "BUY" : "SELL",
      price: 2645 + Math.random() * 10,
      stop_loss: null,
      take_profit: null,
      timeframe: "1H",
      reason: "Test signal from monitor",
      strategy: "Manual Test",
    };

    try {
      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testSignal),
      });

      if (response.ok) {
        fetchSignals(); // Refresh signals
        alert("✅ Test signal generated successfully!");
      } else {
        alert("❌ Failed to generate test signal");
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading signals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Signal Monitor</h2>
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
            onClick={fetchSignals}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-sm font-medium">Total Signals</div>
          <div className="text-2xl font-bold text-blue-800">
            {signals.length}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 text-sm font-medium">Buy Signals</div>
          <div className="text-2xl font-bold text-green-800">
            {signals.filter((s) => s.action === "BUY").length}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-600 text-sm font-medium">Sell Signals</div>
          <div className="text-2xl font-bold text-red-800">
            {signals.filter((s) => s.action === "SELL").length}
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-gray-600 text-sm font-medium">Last Signal</div>
          <div className="text-2xl font-bold text-gray-800">
            {signals.length > 0
              ? new Date(signals[0].timestamp).toLocaleTimeString()
              : "None"}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
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
          onClick={generateTestSignal}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm"
        >
          🧪 Generate Test Signal
        </button>
      </div>

      {/* Signals List */}
      <div className="space-y-3">
        {filteredSignals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📭</div>
            <p>No signals found</p>
            <p className="text-sm">
              Generate a test signal or wait for TradingView alerts
            </p>
          </div>
        ) : (
          filteredSignals.map((signal, index) => (
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
                <div
                  className={`text-sm font-medium ${
                    calculatePnL(signal) > 0
                      ? "text-green-600"
                      : calculatePnL(signal) < 0
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  P&L: ${calculatePnL(signal).toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Live Status */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              autoRefresh ? "bg-green-400 animate-pulse" : "bg-gray-400"
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            {autoRefresh ? "Live monitoring active" : "Live monitoring paused"}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
