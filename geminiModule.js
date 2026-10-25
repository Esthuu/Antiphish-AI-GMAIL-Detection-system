// =========================
// REAL GEMINI AI MODULE
// =========================

async function geminiEmailScore(text) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Analyze the following email and respond ONLY with:
"PHISHING" or "SAFE"

Email:
${text}
                  `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || "";

    // Return AI decision as score
    if (result.includes("phishing")) return 2;
    return 0;

  } catch (error) {
    console.error("Gemini API error:", error);
    return 0; // fallback safe
  }
}
