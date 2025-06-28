"use client";

import { useState } from "react";

export default function EmailAlertSetup() {
  const [activeTab, setActiveTab] = useState("zapier");
  const [showEmailFormat, setShowEmailFormat] = useState(false);

  const emailTemplate = `Subject: XAUUSD Trading Signal

Signal Details:
Symbol: XAUUSD
Action: BUY
Price: 2650.50
Stop Loss: 2645.00
Take Profit: 2660.00
Timeframe: 1H
Reason: Bullish breakout above resistance
Strategy: Breakout Strategy`;

  const zapierSteps = [
    {
      title: "Create Zapier Account",
      description:
        "Sign up for free at zapier.com (free plan allows 100 tasks/month)",
      icon: "👤",
    },
    {
      title: "Create New Zap",
      description: "Click 'Create Zap' and choose Gmail/Email as trigger",
      icon: "⚡",
    },
    {
      title: "Setup Email Trigger",
      description:
        "Configure to trigger on new emails from TradingView notifications",
      icon: "📧",
    },
    {
      title: "Add Webhook Action",
      description: `Set action to 'Webhooks by Zapier' with POST method to your bot's webhook URL`,
      icon: "🔗",
    },
    {
      title: "Parse Email Content",
      description:
        "Use Zapier's text parser to extract trading signal data from email",
      icon: "🔍",
    },
    {
      title: "Test & Activate",
      description: "Test the workflow and activate your Zap",
      icon: "✅",
    },
  ];

  const iftttSteps = [
    {
      title: "Create IFTTT Account",
      description: "Sign up at ifttt.com (free plan available)",
      icon: "👤",
    },
    {
      title: "Create New Applet",
      description: "Click 'Create' to start a new automation",
      icon: "⚡",
    },
    {
      title: "Setup Email Trigger",
      description: "Choose Gmail/Email as 'This' trigger service",
      icon: "📧",
    },
    {
      title: "Add Webhook Action",
      description: "Choose Webhooks as 'That' action service",
      icon: "🔗",
    },
    {
      title: "Configure Webhook",
      description: "Set up POST request to your bot's webhook endpoint",
      icon: "⚙️",
    },
    {
      title: "Activate Applet",
      description: "Save and activate your automation",
      icon: "✅",
    },
  ];

  const powerAutomateSteps = [
    {
      title: "Access Power Automate",
      description:
        "Go to powerautomate.microsoft.com (free with Microsoft account)",
      icon: "👤",
    },
    {
      title: "Create Flow",
      description: "Click 'Create' and choose 'Automated cloud flow'",
      icon: "⚡",
    },
    {
      title: "Email Trigger",
      description:
        "Select 'When a new email arrives' from Outlook/Gmail connector",
      icon: "📧",
    },
    {
      title: "Add HTTP Action",
      description: "Add 'HTTP' action to send POST request to your webhook",
      icon: "🔗",
    },
    {
      title: "Parse Email Data",
      description: "Use expressions to extract signal data from email body",
      icon: "🔍",
    },
    {
      title: "Save & Test",
      description: "Save the flow and test with a sample email",
      icon: "✅",
    },
  ];

  const getCurrentSteps = () => {
    switch (activeTab) {
      case "zapier":
        return zapierSteps;
      case "ifttt":
        return iftttSteps;
      case "powerautomate":
        return powerAutomateSteps;
      default:
        return zapierSteps;
    }
  };

  const testEmailWebhook = async () => {
    try {
      // Simulate email-parsed data
      const emailData = {
        symbol: "XAUUSD",
        action: "BUY",
        price: 2650.5,
        stop_loss: 2645.0,
        take_profit: 2660.0,
        timeframe: "1H",
        reason: "Email alert from TradingView",
        strategy: "Email Bridge",
      };

      const response = await fetch("/api/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        alert(
          "✅ Test email webhook sent successfully! Check your Telegram for the message."
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
          📧 Email Alert Setup
        </h2>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          🆓 Free Alternative
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-800 mb-2">
          ✨ Perfect for TradingView Free Users
        </h3>
        <p className="text-green-700 text-sm">
          Convert TradingView email alerts into Telegram notifications using
          automation tools. This method works with free TradingView accounts and
          provides unlimited alerts!
        </p>
      </div>

      {/* Platform Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("zapier")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "zapier"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          🔗 Zapier
        </button>
        <button
          onClick={() => setActiveTab("ifttt")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "ifttt"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          🔧 IFTTT
        </button>
        <button
          onClick={() => setActiveTab("powerautomate")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "powerautomate"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          ⚡ Power Automate
        </button>
      </div>

      {/* Platform-specific instructions */}
      <div className="space-y-4 mb-6">
        {getCurrentSteps().map((step, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="text-2xl">{step.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1">
                Step {index + 1}: {step.title}
              </h4>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TradingView Email Alert Setup */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-3">
          📬 TradingView Email Alert Configuration
        </h3>
        <div className="space-y-3 text-sm text-blue-700">
          <div className="flex items-start gap-3">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              1
            </span>
            <div>
              <p className="font-semibold">Create Alert on TradingView</p>
              <p>Go to XAUUSD chart and click the alarm icon</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <div>
              <p className="font-semibold">Enable Email Notifications</p>
              <p>In alert settings, check &quot;Send Email&quot; option</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              3
            </span>
            <div>
              <p className="font-semibold">Format Email Message</p>
              <p>Use structured format for easy parsing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Format */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">
            📝 Recommended Email Format
          </h3>
          <button
            onClick={() => setShowEmailFormat(!showEmailFormat)}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            {showEmailFormat ? "Hide" : "Show"} Format
          </button>
        </div>

        {showEmailFormat && (
          <div className="bg-gray-800 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
            <pre>{emailTemplate}</pre>
          </div>
        )}
      </div>

      {/* Parsing Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-3">
          🔍 Email Parsing Configuration
        </h3>
        <div className="space-y-2 text-sm text-yellow-700">
          <p>
            <strong>Symbol:</strong> Extract text after &quot;Symbol: &quot;
          </p>
          <p>
            <strong>Action:</strong> Extract text after &quot;Action: &quot;
          </p>
          <p>
            <strong>Price:</strong> Extract number after &quot;Price: &quot;
          </p>
          <p>
            <strong>Stop Loss:</strong> Extract number after &quot;Stop Loss:
            &quot;
          </p>
          <p>
            <strong>Take Profit:</strong> Extract number after &quot;Take
            Profit: &quot;
          </p>
        </div>
      </div>

      {/* Webhook URL for Automation */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-purple-800 mb-3">
          🔗 Webhook URL for Automation
        </h3>
        <div className="bg-white p-3 rounded border font-mono text-sm">
          {typeof window !== "undefined"
            ? `${window.location.origin}/api/webhook`
            : "Your deployment URL/api/webhook"}
        </div>
        <p className="text-purple-700 text-sm mt-2">
          Use this URL in your automation tool&apos;s webhook action.
        </p>
      </div>

      {/* Test Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-3">
          🧪 Test Email Bridge
        </h3>
        <button
          onClick={testEmailWebhook}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          🚀 Send Test Email Signal
        </button>
        <p className="text-green-700 text-sm mt-2">
          This simulates an email-parsed signal being sent to your Telegram bot.
        </p>
      </div>
    </div>
  );
}
