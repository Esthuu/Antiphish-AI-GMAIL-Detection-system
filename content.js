// 🔴 Highlight UI
function highlight(mail, result, aiText = null) {
  if (mail.dataset.marked) return;

  mail.style.border = "2px solid red";
  mail.style.backgroundColor = "rgba(255,0,0,0.15)";

  let warn = document.createElement("div");
  warn.innerText = "⚠️ Phishing Email Detected";
  warn.style.background = "red";
  warn.style.color = "white";
  warn.style.fontSize = "12px";
  warn.style.padding = "4px";

  mail.prepend(warn);

  let info = document.createElement("div");
  info.innerText = "Matched: " + result.matched.join(", ");
  info.style.fontSize = "11px";
  info.style.color = "black";
  mail.appendChild(info);

  if (aiText) {
    let ai = document.createElement("div");
    ai.innerText = "AI: " + aiText;
    ai.style.background = "black";
    ai.style.color = "yellow";
    ai.style.fontSize = "11px";
    mail.appendChild(ai);
  }

  mail.dataset.marked = "true";
}

// 🤖 Gemini call
function callGemini(text, callback) {
  chrome.runtime.sendMessage(
    { type: "GEMINI", text: text },
    res => callback(res)
  );
}

// 🔍 GMAIL SCAN (CORRECT SELECTOR)
function scan() {

  // ✅ Gmail email body containers
  let mails = document.querySelectorAll("div.a3s");

  mails.forEach(mail => {
    if (mail.dataset.done) return;

    let text = mail.innerText;
    if (!text) return;

    let result = heuristicDetect(text);

    if (result.isPhishing) {

      if (result.score <= 7) {
        callGemini(text, res => {
          let aiText = res?.result || "AI unavailable";
          highlight(mail, result, aiText);
        });
      } else {
        highlight(mail, result);
      }
    }

    mail.dataset.done = "true";
  });
}

// 🔁 Gmail is dynamic → observer needed
const observer = new MutationObserver(scan);

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// initial run
setTimeout(scan, 3000);