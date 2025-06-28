/**
 * API endpoint untuk mendapatkan statistik bot
 * GET /api/stats
 */

// Simple in-memory storage untuk demo (dalam production gunakan database)
let signals = [];

export async function GET() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const todaySignals = signals.filter((signal) => {
      const signalDate = new Date(signal.timestamp);
      return signalDate >= today;
    });

    const lastSignal = signals.length > 0 ? signals[signals.length - 1] : null;

    return Response.json({
      totalSignals: signals.length,
      todaySignals: todaySignals.length,
      lastSignalTime: lastSignal ? lastSignal.timestamp : null,
      botStatus: "online",
    });
  } catch (error) {
    console.error("Stats error:", error);
    return Response.json(
      {
        error: "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}

// Export signals untuk digunakan oleh endpoint lain
export { signals };
