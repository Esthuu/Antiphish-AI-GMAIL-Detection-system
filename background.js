chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "GEMINI") {
    fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: req.text })
    })
      .then(r => r.json())
      .then(d => sendResponse(d))
      .catch(() => sendResponse({ result: "error" }));

    return true;
  }
});