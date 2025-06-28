"use client";

import { useState } from "react";
import TestComponent from "@/components/TestComponent";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("test");

  return (
    <div className="min-h-screen bg-gray-100">
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
                <p className="text-sm text-gray-500">Testing Page</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TestComponent />
      </div>
    </div>
  );
}
