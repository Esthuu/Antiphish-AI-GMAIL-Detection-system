const keywordDB = [
  { word: "verify", weight: 2 },
  { word: "login", weight: 3 },
  { word: "account", weight: 1 },
  { word: "urgent", weight: 2 },
  { word: "password", weight: 3 },
  { word: "bank", weight: 2 },
  { word: "click", weight: 1 },
  { word: "free", weight: 1 }
];

function preprocess(text) {
  return text.toLowerCase();
}

function heuristicDetect(text) {
  let clean = preprocess(text);
  let score = 0;
  let matched = [];

  keywordDB.forEach(k => {
    if (clean.includes(k.word)) {
      score += k.weight;
      matched.push(k.word);
    }
  });

  if (clean.includes("http")) {
    score += 3;
    matched.push("url");
  }

  ["now", "immediately"].forEach(w => {
    if (clean.includes(w)) score += 2;
  });

  return {
    score: score,
    matched: matched,
    isPhishing: score >= 4
  };
}