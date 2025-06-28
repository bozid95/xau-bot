"use client";

import { useState, useEffect } from "react";

export default function StrategyInput() {
  const [activeTab, setActiveTab] = useState("manual");
  const [strategies, setStrategies] = useState([]);
  const [manualSignal, setManualSignal] = useState({
    action: "",
    price: "",
    stopLoss: "",
    takeProfit: "",
    timeframe: "1H",
    reason: "",
    strategy: "",
  });

  const [customStrategy, setCustomStrategy] = useState({
    name: "",
    description: "",
    rules: "",
    riskManagement: {
      stopLossPercent: 2,
      takeProfitPercent: 4,
      maxPositionSize: 0.1,
    },
  });

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadSavedStrategies();
  }, []);

  const loadSavedStrategies = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tradingStrategies");
      if (saved) {
        setStrategies(JSON.parse(saved));
      }
    }
  };

  const saveStrategies = (newStrategies) => {
    setStrategies(newStrategies);
    if (typeof window !== "undefined") {
      localStorage.setItem("tradingStrategies", JSON.stringify(newStrategies));
    }
  };

  const predefinedStrategies = [
    {
      name: "Breakout Strategy",
      description: "Trade breakouts above/below key levels",
      buyCondition: "Price breaks above resistance",
      sellCondition: "Price breaks below support",
      stopLoss: "Previous support/resistance",
      takeProfit: "2:1 risk/reward ratio",
    },
    {
      name: "RSI Reversal",
      description: "Trade RSI oversold/overbought reversals",
      buyCondition: "RSI < 30 and price showing bullish divergence",
      sellCondition: "RSI > 70 and price showing bearish divergence",
      stopLoss: "Recent swing high/low",
      takeProfit: "Next resistance/support level",
    },
    {
      name: "MA Crossover",
      description: "Moving average crossover strategy",
      buyCondition: "Fast MA crosses above Slow MA",
      sellCondition: "Fast MA crosses below Slow MA",
      stopLoss: "Below recent swing low",
      takeProfit: "3:1 risk/reward ratio",
    },
    {
      name: "News Trading",
      description: "Trade major news events",
      buyCondition: "Positive news catalyst",
      sellCondition: "Negative news catalyst",
      stopLoss: "Pre-news price level",
      takeProfit: "Based on volatility",
    },
  ];

  const sendManualSignal = async () => {
    setSending(true);
    setResult(null);

    try {
      const payload = {
        symbol: "XAUUSD",
        action: manualSignal.action,
        price: parseFloat(manualSignal.price),
        stop_loss: manualSignal.stopLoss
          ? parseFloat(manualSignal.stopLoss)
          : null,
        take_profit: manualSignal.takeProfit
          ? parseFloat(manualSignal.takeProfit)
          : null,
        timeframe: manualSignal.timeframe,
        reason: manualSignal.reason,
        strategy: manualSignal.strategy || "Manual Entry",
      };

      const response = await fetch("/api/manual-signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: "Signal sent successfully!" });
        // Reset form
        setManualSignal({
          action: "",
          price: "",
          stopLoss: "",
          takeProfit: "",
          timeframe: "1H",
          reason: "",
          strategy: "",
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

  const applyStrategy = (strategy) => {
    setManualSignal((prev) => ({
      ...prev,
      strategy: strategy.name,
      reason: `Using ${strategy.name}: ${strategy.description}`,
    }));
    setActiveTab("manual");
  };

  const saveCustomStrategy = () => {
    if (!customStrategy.name) {
      alert("Please enter a strategy name");
      return;
    }

    const newStrategy = {
      ...customStrategy,
      id: Date.now(),
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    const updatedStrategies = [...strategies, newStrategy];
    saveStrategies(updatedStrategies);

    // Reset form
    setCustomStrategy({
      name: "",
      description: "",
      rules: "",
      riskManagement: {
        stopLossPercent: 2,
        takeProfitPercent: 4,
        maxPositionSize: 0.1,
      },
    });

    alert("Strategy saved successfully!");
  };

  const deleteStrategy = (strategyId) => {
    if (confirm("Are you sure you want to delete this strategy?")) {
      const updatedStrategies = strategies.filter((s) => s.id !== strategyId);
      saveStrategies(updatedStrategies);
    }
  };

  const quickFillSignal = (type) => {
    const currentPrice = 2650 + (Math.random() - 0.5) * 10;

    const templates = {
      buy: {
        action: "BUY",
        price: currentPrice.toFixed(2),
        stopLoss: (currentPrice - 20).toFixed(2),
        takeProfit: (currentPrice + 40).toFixed(2),
        reason: "Bullish setup identified",
      },
      sell: {
        action: "SELL",
        price: currentPrice.toFixed(2),
        stopLoss: (currentPrice + 20).toFixed(2),
        takeProfit: (currentPrice - 40).toFixed(2),
        reason: "Bearish setup identified",
      },
      close: {
        action: "CLOSE",
        price: currentPrice.toFixed(2),
        stopLoss: "",
        takeProfit: "",
        reason: "Closing position",
      },
    };

    setManualSignal((prev) => ({
      ...prev,
      ...templates[type],
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          📈 Strategy & Signal Input
        </h2>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          XAUUSD Trading
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("manual")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "manual"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📱 Manual Signal
        </button>
        <button
          onClick={() => setActiveTab("strategies")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "strategies"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📋 Strategy Library
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "custom"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          ⚙️ Custom Strategy
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Manual Signal Tab */}
        {activeTab === "manual" && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                📊 Send Trading Signal
              </h3>
              <p className="text-blue-700 text-sm">
                Manually input trading signals for XAUUSD. Signals will be sent
                directly to your Telegram bot.
              </p>
            </div>

            {/* Quick Fill Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => quickFillSignal("buy")}
                className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
              >
                🟢 Quick BUY
              </button>
              <button
                onClick={() => quickFillSignal("sell")}
                className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
              >
                🔴 Quick SELL
              </button>
              <button
                onClick={() => quickFillSignal("close")}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
              >
                ⚪ Quick CLOSE
              </button>
            </div>

            {/* Signal Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action *
                  </label>
                  <select
                    value={manualSignal.action}
                    onChange={(e) =>
                      setManualSignal((prev) => ({
                        ...prev,
                        action: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Action</option>
                    <option value="BUY">🟢 BUY</option>
                    <option value="SELL">🔴 SELL</option>
                    <option value="CLOSE">⚪ CLOSE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entry Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualSignal.price}
                    onChange={(e) =>
                      setManualSignal((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="2650.50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stop Loss
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualSignal.stopLoss}
                    onChange={(e) =>
                      setManualSignal((prev) => ({
                        ...prev,
                        stopLoss: e.target.value,
                      }))
                    }
                    placeholder="2645.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Take Profit
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={manualSignal.takeProfit}
                    onChange={(e) =>
                      setManualSignal((prev) => ({
                        ...prev,
                        takeProfit: e.target.value,
                      }))
                    }
                    placeholder="2660.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeframe
                  </label>
                  <select
                    value={manualSignal.timeframe}
                    onChange={(e) =>
                      setManualSignal((prev) => ({
                        ...prev,
                        timeframe: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strategy Name
                  </label>
                  <input
                    type="text"
                    value={manualSignal.strategy}
                    onChange={(e) =>
                      setManualSignal((prev) => ({
                        ...prev,
                        strategy: e.target.value,
                      }))
                    }
                    placeholder="Strategy Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Analysis/Reason
              </label>
              <textarea
                value={manualSignal.reason}
                onChange={(e) =>
                  setManualSignal((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                placeholder="Technical analysis, market conditions, or reason for the trade..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              onClick={sendManualSignal}
              disabled={sending || !manualSignal.action || !manualSignal.price}
              className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                sending || !manualSignal.action || !manualSignal.price
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {sending ? "📤 Sending Signal..." : "📤 Send Signal to Telegram"}
            </button>

            {result && (
              <div
                className={`p-4 rounded-lg ${
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
          </div>
        )}

        {/* Strategy Library Tab */}
        {activeTab === "strategies" && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">
                📚 Strategy Library
              </h3>
              <p className="text-green-700 text-sm">
                Choose from predefined strategies or use your custom strategies.
                Click &quot;Use Strategy&quot; to apply it to manual signals.
              </p>
            </div>

            {/* Predefined Strategies */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">
                🏗️ Predefined Strategies
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predefinedStrategies.map((strategy, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-800">
                        {strategy.name}
                      </h5>
                      <button
                        onClick={() => applyStrategy(strategy)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Use Strategy
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {strategy.description}
                    </p>
                    <div className="space-y-2 text-xs">
                      <div>
                        <strong>Buy:</strong> {strategy.buyCondition}
                      </div>
                      <div>
                        <strong>Sell:</strong> {strategy.sellCondition}
                      </div>
                      <div>
                        <strong>Stop Loss:</strong> {strategy.stopLoss}
                      </div>
                      <div>
                        <strong>Take Profit:</strong> {strategy.takeProfit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Strategies */}
            {strategies.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-4">
                  ⚙️ Your Custom Strategies
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-800">
                          {strategy.name}
                        </h5>
                        <div className="flex gap-2">
                          <button
                            onClick={() => applyStrategy(strategy)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                          >
                            Use
                          </button>
                          <button
                            onClick={() => deleteStrategy(strategy.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {strategy.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(strategy.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Strategy Tab */}
        {activeTab === "custom" && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">
                ⚙️ Create Custom Strategy
              </h3>
              <p className="text-purple-700 text-sm">
                Define your own trading strategy with custom rules and risk
                management parameters.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strategy Name *
                  </label>
                  <input
                    type="text"
                    value={customStrategy.name}
                    onChange={(e) =>
                      setCustomStrategy((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="My Custom Strategy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={customStrategy.description}
                    onChange={(e) =>
                      setCustomStrategy((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description of the strategy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trading Rules
                </label>
                <textarea
                  value={customStrategy.rules}
                  onChange={(e) =>
                    setCustomStrategy((prev) => ({
                      ...prev,
                      rules: e.target.value,
                    }))
                  }
                  placeholder="Define your entry and exit rules, conditions, indicators to use, etc."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-4">
                  💰 Risk Management
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stop Loss %
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={customStrategy.riskManagement.stopLossPercent}
                      onChange={(e) =>
                        setCustomStrategy((prev) => ({
                          ...prev,
                          riskManagement: {
                            ...prev.riskManagement,
                            stopLossPercent: parseFloat(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Take Profit %
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={customStrategy.riskManagement.takeProfitPercent}
                      onChange={(e) =>
                        setCustomStrategy((prev) => ({
                          ...prev,
                          riskManagement: {
                            ...prev.riskManagement,
                            takeProfitPercent: parseFloat(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Position Size
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={customStrategy.riskManagement.maxPositionSize}
                      onChange={(e) =>
                        setCustomStrategy((prev) => ({
                          ...prev,
                          riskManagement: {
                            ...prev.riskManagement,
                            maxPositionSize: parseFloat(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={saveCustomStrategy}
                disabled={!customStrategy.name}
                className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
                  !customStrategy.name
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                💾 Save Custom Strategy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
