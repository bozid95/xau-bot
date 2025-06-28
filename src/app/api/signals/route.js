/**
 * API endpoint untuk mendapatkan riwayat sinyal
 * GET /api/signals
 */

// Import signals dari stats route
import { signals } from "../stats/route.js";

export async function GET() {
  try {
    // Urutkan signals berdasarkan timestamp terbaru
    const sortedSignals = [...signals].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    return Response.json({
      success: true,
      signals: sortedSignals,
      count: sortedSignals.length,
    });
  } catch (error) {
    console.error("Signals fetch error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch signals",
        signals: [],
      },
      { status: 500 }
    );
  }
}
