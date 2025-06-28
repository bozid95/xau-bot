/**
 * API endpoint untuk testing koneksi Telegram
 * POST /api/test-telegram
 */
export async function POST(request) {
  try {
    const { botToken, chatId } = await request.json();

    if (!botToken || !chatId) {
      return Response.json(
        {
          success: false,
          error: "Bot token and chat ID are required",
        },
        { status: 400 }
      );
    }

    // Test dengan mengirim pesan sederhana
    const testMessage = `🤖 Test Connection\n\nXAUUSD Trading Bot berhasil terhubung!\nWaktu: ${new Date().toLocaleString()}`;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMessage,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(
        {
          success: false,
          error: errorData.description || "Failed to send test message",
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: "Test message sent successfully!",
    });
  } catch (error) {
    console.error("Test Telegram error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
