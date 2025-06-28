/**
 * Test endpoint khusus untuk debugging Zapier webhook
 * POST /api/test-zapier
 */
export async function POST(request) {
  try {
    console.log("=== ZAPIER TEST ENDPOINT ===");

    // Log semua headers
    const headers = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log("Request headers:", headers);

    // Get raw body
    const rawBody = await request.text();
    console.log("Raw body received:", rawBody);
    console.log("Body type:", typeof rawBody);
    console.log("Body length:", rawBody.length);

    if (!rawBody || rawBody.trim() === "") {
      return Response.json(
        {
          error: "Empty request body",
          help: "Zapier must send JSON data in request body",
          example: {
            symbol: "XAUUSD",
            action: "BUY",
            price: "2650.50",
          },
        },
        { status: 400 }
      );
    }

    // Try parsing JSON
    let parsedData;
    try {
      parsedData = JSON.parse(rawBody);
      console.log("Successfully parsed JSON:", parsedData);
    } catch (parseError) {
      console.error("JSON parse failed:", parseError);
      return Response.json(
        {
          error: "Invalid JSON format",
          received_raw: rawBody,
          parse_error: parseError.message,
          help: "Check Zapier webhook data format. Ensure valid JSON syntax.",
          correct_format: {
            symbol: "XAUUSD",
            action: "BUY",
            price: "2650.50",
          },
        },
        { status: 400 }
      );
    }

    // Check data structure
    console.log("Data type:", typeof parsedData);
    console.log("Data keys:", Object.keys(parsedData || {}));

    // Detailed field checking
    const requiredFields = ["symbol", "action", "price"];
    const fieldStatus = {};
    const missingFields = [];

    requiredFields.forEach((field) => {
      const exists = parsedData.hasOwnProperty(field);
      const value = parsedData[field];
      const hasValue = value !== null && value !== undefined && value !== "";

      fieldStatus[field] = {
        exists: exists,
        value: value,
        hasValue: hasValue,
        type: typeof value,
      };

      if (!exists || !hasValue) {
        missingFields.push(field);
      }
    });

    console.log("Field analysis:", fieldStatus);

    if (missingFields.length > 0) {
      return Response.json(
        {
          error: "Missing or empty required fields",
          missing_fields: missingFields,
          field_analysis: fieldStatus,
          received_data: parsedData,
          zapier_fix: {
            instruction:
              "In Zapier webhook action, ensure Data field contains:",
            required_json: {
              symbol: "XAUUSD",
              action: "BUY",
              price: "2650.50",
            },
            note: "All field names must be in double quotes, values in double quotes for strings",
          },
        },
        { status: 400 }
      );
    }

    // Validate field values
    const validation = {
      symbol: parsedData.symbol === "XAUUSD",
      action: ["BUY", "SELL", "CLOSE"].includes(
        parsedData.action?.toUpperCase()
      ),
      price:
        !isNaN(parseFloat(parsedData.price)) &&
        parseFloat(parsedData.price) > 0,
    };

    const invalidFields = Object.keys(validation).filter(
      (key) => !validation[key]
    );

    if (invalidFields.length > 0) {
      return Response.json(
        {
          error: "Invalid field values",
          invalid_fields: invalidFields,
          validation_details: {
            symbol: {
              received: parsedData.symbol,
              expected: "XAUUSD",
              valid: validation.symbol,
            },
            action: {
              received: parsedData.action,
              expected: "BUY, SELL, or CLOSE",
              valid: validation.action,
            },
            price: {
              received: parsedData.price,
              expected: "positive number",
              valid: validation.price,
            },
          },
        },
        { status: 400 }
      );
    }

    // All validations passed
    return Response.json({
      success: true,
      message: "Zapier webhook test successful! ✅",
      received_data: parsedData,
      field_analysis: fieldStatus,
      validation_results: validation,
      next_steps: [
        "1. Your JSON format is correct",
        "2. Change webhook URL back to /api/webhook",
        "3. Turn on your Zap",
        "4. Test with real TradingView email",
      ],
      production_url: "https://your-bot.vercel.app/api/webhook",
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return Response.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint untuk test instructions
 */
export async function GET() {
  return Response.json({
    title: "Zapier Test Endpoint",
    description: "Use this endpoint to debug Zapier webhook issues",
    usage: {
      method: "POST",
      url: "https://your-bot.vercel.app/api/test-zapier",
      content_type: "application/json",
    },
    test_data: {
      symbol: "XAUUSD",
      action: "BUY",
      price: "2650.50",
      stop_loss: "2630.50",
      take_profit: "2680.50",
      timeframe: "1H",
      reason: "Zapier test",
      strategy: "Email Bridge",
    },
    zapier_steps: [
      "1. In Zapier webhook action, change URL to this endpoint",
      "2. Copy test_data above to Data field",
      "3. Test the action",
      "4. Check response for debugging info",
      "5. Fix any issues shown in response",
      "6. Change URL back to /api/webhook when working",
    ],
  });
}
