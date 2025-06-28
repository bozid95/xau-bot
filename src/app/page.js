"use client";

import { useState, useEffect } from "react";
import BotSetup from "@/components/BotSetup";
import StrategyInput from "@/components/StrategyInput";
import Monitor from "@/components/Monitor";
import StatsCard from "@/components/StatsCard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("setup");
  const [stats, setStats] = useState({
    totalSignals: 0,
    todaySignals: 0,
    lastSignalTime: null,
    botStatus: "offline",
  });

  const [config, setConfig] = useState({
    botToken: "",
    chatId: "",
    isConfigured: false,
  });

  useEffect(() => {
    // Load saved configuration
    const savedConfig = localStorage.getItem("botSetupConfig");
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig({
        botToken: parsedConfig.botToken || "",
        chatId: parsedConfig.chatId || "",
        isConfigured: !!(parsedConfig.botToken && parsedConfig.chatId),
      });
    }

    // Load stats
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const tabs = [
    {
      id: "setup",
      label: "�️ Bot Setup",
      icon: "�️",
      description: "Configure Telegram, Deployment, TradingView & Email",
    },
    {
      id: "strategy",
      label: "� Strategy Input",
      icon: "�",
      description: "Manual Signals & Strategy Management",
    },
    {
      id: "monitor",
      label: "📺 Monitor",
      icon: "📺",
      description: "Live Signals & Connection Status",
    },
  ];

  const isDeployed =
    typeof window !== "undefined" &&
    !window.location.origin.includes("localhost");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                🥇
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  XAUUSD Trading Bot
                </h1>
                <p className="text-sm text-gray-500">
                  TradingView + Telegram Integration
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  isDeployed
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {isDeployed ? "🟢 Deployed" : "🟡 Local Dev"}
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  config.isConfigured
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {config.isConfigured ? "🤖 Bot Ready" : "⚠️ Setup Required"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-2xl">{tab.icon}</span>
                    <span className="font-semibold">{tab.label}</span>
                    <span className="text-xs text-gray-400 hidden sm:block">
                      {tab.description}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "setup" && (
            <>
              {/* Quick Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Bot Status"
                  value={config.isConfigured ? "Configured" : "Setup Required"}
                  icon={config.isConfigured ? "🟢" : "⚠️"}
                  color={config.isConfigured ? "green" : "yellow"}
                />
                <StatsCard
                  title="Deployment"
                  value={isDeployed ? "Live" : "Local"}
                  icon={isDeployed ? "🚀" : "💻"}
                  color={isDeployed ? "purple" : "yellow"}
                />
                <StatsCard
                  title="Total Signals"
                  value={stats.totalSignals}
                  icon="📊"
                  color="blue"
                />
                <StatsCard
                  title="Today's Signals"
                  value={stats.todaySignals}
                  icon="📈"
                  color="green"
                />
              </div>
              <BotSetup />
            </>
          )}

          {activeTab === "strategy" && <StrategyInput />}
          {activeTab === "monitor" && <Monitor />}
        </div>
      </div>
    </div>
  );
}
