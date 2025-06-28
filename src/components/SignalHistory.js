"use client";

import { useState, useEffect } from "react";

export default function SignalHistory() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignals();
  }, []);

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

  const getActionColor = (action) => {
    switch (action?.toUpperCase()) {
      case "BUY":
        return "text-green-600 bg-green-100";
      case "SELL":
        return "text-red-600 bg-red-100";
      case "CLOSE":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const getActionEmoji = (action) => {
    switch (action?.toUpperCase()) {
      case "BUY":
        return "🟢";
      case "SELL":
        return "🔴";
      case "CLOSE":
        return "⚪";
      default:
        return "🔵";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (signals.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="text-4xl mb-2">📊</div>
        <p>No signals received yet</p>
        <p className="text-sm">
          Configure your TradingView alerts to start receiving signals
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {signals.slice(0, 5).map((signal, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getActionEmoji(signal.action)}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(
                  signal.action
                )}`}
              >
                {signal.action}
              </span>
              <span className="text-sm font-medium text-gray-900">
                ${signal.price?.toFixed(2)}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {signal.timestamp
                ? new Date(signal.timestamp).toLocaleTimeString()
                : "Unknown time"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            {signal.stopLoss && (
              <div>
                <span className="font-medium">SL:</span> $
                {signal.stopLoss.toFixed(2)}
              </div>
            )}
            {signal.takeProfit && (
              <div>
                <span className="font-medium">TP:</span> $
                {signal.takeProfit.toFixed(2)}
              </div>
            )}
          </div>

          {signal.reason && (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">Reason:</span> {signal.reason}
            </div>
          )}
        </div>
      ))}

      {signals.length > 5 && (
        <div className="text-center">
          <button
            onClick={() => (window.location.href = "/signals")}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View all signals ({signals.length})
          </button>
        </div>
      )}
    </div>
  );
}
