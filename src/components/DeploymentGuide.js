"use client";

import { useState } from "react";

export default function DeploymentGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [deploymentUrl, setDeploymentUrl] = useState("");

  const deploymentSteps = [
    {
      title: "Prepare Your Code",
      description:
        "Ensure all files are saved and environment variables are configured",
      icon: "📝",
      details: [
        "Save all your project files",
        "Check that .env.example exists with all required variables",
        "Ensure package.json has all dependencies",
        "Test locally if possible",
      ],
    },
    {
      title: "Create GitHub Repository",
      description: "Push your code to GitHub for Vercel deployment",
      icon: "🐙",
      details: [
        "Go to github.com and create new repository",
        "Initialize git in your project: git init",
        "Add files: git add .",
        'Commit: git commit -m "Initial commit"',
        "Add remote: git remote add origin [your-repo-url]",
        "Push: git push -u origin main",
      ],
    },
    {
      title: "Connect to Vercel",
      description: "Link your GitHub repository to Vercel",
      icon: "▲",
      details: [
        "Go to vercel.com and sign up/login",
        'Click "New Project"',
        "Connect your GitHub account",
        "Select your bot repository",
        'Click "Import"',
      ],
    },
    {
      title: "Configure Environment Variables",
      description: "Add your Telegram bot credentials to Vercel",
      icon: "🔧",
      details: [
        "In Vercel dashboard, go to your project settings",
        'Click "Environment Variables"',
        "Add TELEGRAM_BOT_TOKEN with your bot token",
        "Add TELEGRAM_CHAT_ID with your chat ID",
        "Optionally add TRADINGVIEW_SECRET for webhook security",
      ],
    },
    {
      title: "Deploy",
      description: "Deploy your bot to get a live HTTPS URL",
      icon: "🚀",
      details: [
        'Click "Deploy" in Vercel',
        "Wait for deployment to complete",
        "Get your deployment URL (e.g., your-bot.vercel.app)",
        "Test the webhook endpoint: [url]/api/webhook",
      ],
    },
    {
      title: "Update Webhook URLs",
      description: "Use your new HTTPS URL for TradingView webhooks",
      icon: "🔗",
      details: [
        "Copy your Vercel deployment URL",
        "Update TradingView alerts with: [url]/api/webhook",
        "Update automation tools with the same URL",
        "Test webhook functionality",
      ],
    },
  ];

  const envVariables = [
    {
      name: "TELEGRAM_BOT_TOKEN",
      description: "Your Telegram bot token from BotFather",
      required: true,
      example: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
    },
    {
      name: "TELEGRAM_CHAT_ID",
      description: "Your Telegram chat ID or channel ID",
      required: true,
      example: "123456789 or @yourchannel",
    },
    {
      name: "TRADINGVIEW_SECRET",
      description: "Secret key for webhook security (optional but recommended)",
      required: false,
      example: "your-secret-key-here",
    },
  ];

  const quickCommands = {
    git: [
      "git init",
      "git add .",
      'git commit -m "Initial commit"',
      "git branch -M main",
      "git remote add origin https://github.com/yourusername/your-repo.git",
      "git push -u origin main",
    ],
  };

  const testDeployment = async () => {
    if (!deploymentUrl) {
      alert("Please enter your deployment URL first");
      return;
    }

    try {
      const testUrl = deploymentUrl.endsWith("/")
        ? `${deploymentUrl}api/test-telegram`
        : `${deploymentUrl}/api/test-telegram`;

      const response = await fetch(testUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Testing deployment from dashboard",
        }),
      });

      if (response.ok) {
        alert(
          "✅ Deployment test successful! Check your Telegram for the test message."
        );
      } else {
        alert(
          "❌ Deployment test failed. Check your environment variables and bot configuration."
        );
      }
    } catch (error) {
      alert(`❌ Test failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🚀 Deployment Guide
        </h2>
        <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
          Vercel + GitHub
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">🎯 Why Deploy?</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• TradingView webhooks require HTTPS URLs</li>
          <li>• 24/7 availability without keeping your computer on</li>
          <li>• Free hosting on Vercel</li>
          <li>• Automatic deployments from GitHub</li>
        </ul>
      </div>

      {/* Step Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {deploymentSteps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold cursor-pointer transition-colors ${
                index <= activeStep
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
              onClick={() => setActiveStep(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((activeStep + 1) / deploymentSteps.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{deploymentSteps[activeStep].icon}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Step {activeStep + 1}: {deploymentSteps[activeStep].title}
            </h3>
            <p className="text-gray-600">
              {deploymentSteps[activeStep].description}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {deploymentSteps[activeStep].details.map((detail, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">•</span>
              <span className="text-gray-700 text-sm">{detail}</span>
            </div>
          ))}
        </div>

        {/* Special content for Git step */}
        {activeStep === 1 && (
          <div className="mt-4 p-4 bg-gray-800 text-green-400 rounded-md">
            <p className="text-sm font-semibold mb-2">Git Commands:</p>
            {quickCommands.git.map((command, index) => (
              <div key={index} className="font-mono text-sm py-1">
                $ {command}
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeStep === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={() =>
              setActiveStep(
                Math.min(deploymentSteps.length - 1, activeStep + 1)
              )
            }
            disabled={activeStep === deploymentSteps.length - 1}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeStep === deploymentSteps.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Environment Variables Reference */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-3">
          🔧 Environment Variables
        </h3>
        <div className="space-y-3">
          {envVariables.map((env, index) => (
            <div key={index} className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 mb-1">
                <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {env.name}
                </code>
                {env.required && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                    Required
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{env.description}</p>
              <code className="text-xs text-gray-500">
                Example: {env.example}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Test Deployment */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-3">
          🧪 Test Your Deployment
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Deployment URL
            </label>
            <input
              type="url"
              value={deploymentUrl}
              onChange={(e) => setDeploymentUrl(e.target.value)}
              placeholder="https://your-bot.vercel.app"
              className="w-full px-3 py-2 border border-green-300 rounded-md"
            />
          </div>
          <button
            onClick={testDeployment}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            🚀 Test Deployment
          </button>
        </div>
        <p className="text-green-700 text-sm mt-2">
          This will send a test message to your Telegram bot to verify the
          deployment is working.
        </p>
      </div>
    </div>
  );
}
