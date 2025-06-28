"use client";

import { useState } from "react";

export default function ManualSignalInput() {
  const [formData, setFormData] = useState({
    action: "",
    price: "",
    stopLoss: "",
    takeProfit: "",
    timeframe: "1H",
    reason: "",
    strategy: "Manual Entry",
  });

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult(null);

    try {
      const payload = {
        symbol: "XAUUSD",
        action: formData.action,
        price: parseFloat(formData.price),
        stop_loss: formData.stopLoss ? parseFloat(formData.stopLoss) : null,
        take_profit: formData.takeProfit
          ? parseFloat(formData.takeProfit)
          : null,
        timeframe: formData.timeframe,
        reason: formData.reason,
        strategy: formData.strategy || "Manual Entry",
      };

      const response = await fetch("/api/manual-signal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
        // Reset form
        setFormData({
          action: "",
          price: "",
          stopLoss: "",
          takeProfit: "",
          timeframe: "1H",
          reason: "",
          strategy: "Manual Entry",
        });
      } else {
        setResult({ success: false, message: data.error });
      }
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const quickFill = (preset) => {
    const presets = {
      buyExample: {
        action: "BUY",
        price: "2650.50",
        stopLoss: "2645.00",
        takeProfit: "2660.00",
        timeframe: "1H",
        reason: "Bullish breakout above resistance level",
        strategy: "Breakout Strategy",
      },
      sellExample: {
        action: "SELL",
        price: "2650.50",
        stopLoss: "2655.00",
        takeProfit: "2640.00",
        timeframe: "1H",
        reason: "Bearish rejection at resistance",
        strategy: "Resistance Rejection",
      },
      closeExample: {
        action: "CLOSE",
        price: "2652.00",
        stopLoss: "",
        takeProfit: "",
        timeframe: "1H",
        reason: "Target reached, closing position",
        strategy: "Profit Taking",
      },
    };

    if (presets[preset]) {
      setFormData(presets[preset]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📱 Manual Signal Input
        </h2>
        <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
          Any Platform
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Quick Access</h3>
        <p className="text-blue-700 text-sm mb-3">
          Send signals from any device or platform. Perfect for manual analysis
          or signals from other trading platforms.
        </p>
        <div className="text-sm text-blue-600">
          <strong>Mobile URL:</strong>{" "}
          <code className="bg-blue-100 px-2 py-1 rounded">
            {typeof window !== "undefined"
              ? `${window.location.origin}/api/manual-signal`
              : "Your-Domain/api/manual-signal"}
          </code>
        </div>
      </div>

      {/* Quick Fill Buttons */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => quickFill("buyExample")}
          className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
        >
          🟢 Fill BUY Example
        </button>
        <button
          onClick={() => quickFill("sellExample")}
          className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
        >
          🔴 Fill SELL Example
        </button>
        <button
          onClick={() => quickFill("closeExample")}
          className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200 transition-colors"
        >
          ⚪ Fill CLOSE Example
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Action */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action *
            </label>
            <select
              value={formData.action}
              onChange={(e) => handleInputChange("action", e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Action</option>
              <option value="BUY">🟢 BUY</option>
              <option value="SELL">🔴 SELL</option>
              <option value="CLOSE">⚪ CLOSE</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="2650.50"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stop Loss */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stop Loss
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.stopLoss}
              onChange={(e) => handleInputChange("stopLoss", e.target.value)}
              placeholder="2645.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Take Profit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Take Profit
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.takeProfit}
              onChange={(e) => handleInputChange("takeProfit", e.target.value)}
              placeholder="2660.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timeframe
            </label>
            <select
              value={formData.timeframe}
              onChange={(e) => handleInputChange("timeframe", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1M">1 Minute</option>
              <option value="5M">5 Minutes</option>
              <option value="15M">15 Minutes</option>
              <option value="30M">30 Minutes</option>
              <option value="1H">1 Hour</option>
              <option value="4H">4 Hours</option>
              <option value="1D">1 Day</option>
            </select>
          </div>

          {/* Strategy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Strategy Name
            </label>
            <input
              type="text"
              value={formData.strategy}
              onChange={(e) => handleInputChange("strategy", e.target.value)}
              placeholder="Manual Entry"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Analysis/Reason
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleInputChange("reason", e.target.value)}
            placeholder="Technical analysis or reason for the trade..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={sending || !formData.action || !formData.price}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
            sending || !formData.action || !formData.price
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {sending ? "📤 Sending..." : "📤 Send Signal to Telegram"}
        </button>
      </form>

      {/* Result Message */}
      {result && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            result.success
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{result.success ? "✅" : "❌"}</span>
            <span>{result.message}</span>
          </div>
        </div>
      )}

      {/* Mobile Access Info */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">📱 Mobile Access</h3>
        <p className="text-gray-600 text-sm mb-3">
          You can also access this form directly from any mobile device or embed
          it in other applications.
        </p>
        <div className="bg-gray-800 text-green-400 p-3 rounded text-sm font-mono">
          GET/POST:{" "}
          {typeof window !== "undefined"
            ? `${window.location.origin}/api/manual-signal`
            : "Your-Domain/api/manual-signal"}
        </div>
        <p className="text-gray-500 text-xs mt-2">
          GET request shows the mobile-friendly form, POST request submits the
          signal.
        </p>
      </div>
    </div>
  );
}
