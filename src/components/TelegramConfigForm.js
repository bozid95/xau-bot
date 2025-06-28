"use client";

import { useState, useEffect } from "react";

export default function TelegramConfigForm() {
  const [config, setConfig] = useState({
    botToken: "",
    chatId: "",
    isConfigured: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem("telegramConfig");
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
    }
  }, []);

  const handleSave = () => {
    const updatedConfig = {
      ...config,
      isConfigured: config.botToken && config.chatId,
    };
    setConfig(updatedConfig);
    localStorage.setItem("telegramConfig", JSON.stringify(updatedConfig));
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const testConnection = async () => {
    setTesting(true);

    try {
      const response = await fetch("/api/test-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botToken: config.botToken,
          chatId: config.chatId,
          message: "🧪 Test message from XAUUSD Trading Bot Dashboard",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Test successful! Check your Telegram for the message.");
        const updatedConfig = { ...config, isConfigured: true };
        setConfig(updatedConfig);
        localStorage.setItem("telegramConfig", JSON.stringify(updatedConfig));
      } else {
        alert(`❌ Test failed: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      alert(`❌ Test failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🤖 Telegram Bot Setup
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-sm ${
            config.isConfigured
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {config.isConfigured ? "✅ Configured" : "⚠️ Not Configured"}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bot Token
          </label>
          {isEditing ? (
            <input
              type="password"
              value={config.botToken || ""}
              onChange={(e) => handleChange("botToken", e.target.value)}
              placeholder="Enter your Telegram bot token"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">
                {config.botToken ? "••••••••••••••••" : "Not configured"}
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chat ID
          </label>
          {isEditing ? (
            <input
              type="text"
              value={config.chatId || ""}
              onChange={(e) => handleChange("chatId", e.target.value)}
              placeholder="Enter your Telegram chat ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">
                {config.chatId || "Not configured"}
              </span>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
              )}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        )}

        {!isEditing && config.botToken && config.chatId && (
          <button
            onClick={testConnection}
            disabled={testing}
            className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              testing
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {testing ? "🧪 Testing..." : "🧪 Test Connection"}
          </button>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">
            Setup Instructions:
          </h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Create a new bot with @BotFather on Telegram</li>
            <li>2. Copy the bot token and paste it above</li>
            <li>3. Send a message to your bot</li>
            <li>4. Get your chat ID from @userinfobot</li>
            <li>5. Paste the chat ID above and test the connection</li>
          </ol>
        </div>

        {/* Quick Setup Guide */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-3">
            🚀 Quick Setup Guide
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <div>
                <p className="font-semibold text-yellow-800">Create Bot</p>
                <p className="text-yellow-700">
                  Message @BotFather on Telegram and type /newbot
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <div>
                <p className="font-semibold text-yellow-800">Get Token</p>
                <p className="text-yellow-700">
                  Copy the bot token from BotFather&apos;s message
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                3
              </span>
              <div>
                <p className="font-semibold text-yellow-800">Get Chat ID</p>
                <p className="text-yellow-700">
                  Message @userinfobot to get your chat ID
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                4
              </span>
              <div>
                <p className="font-semibold text-yellow-800">Test Connection</p>
                <p className="text-yellow-700">
                  Save credentials and click Test Connection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
