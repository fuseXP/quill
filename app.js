// ============================================================
//  Quill — AI Writing Assistant
//  Powered by Hugging Face Inference API
// ============================================================

const API_KEY = "PASTE_YOUR_HF_TOKEN_HERE";
const MODEL   = "moonshotai/Kimi-K2-Instruct-0905";
const API_URL = "https://router.huggingface.co/v1/chat/completions";

let currentMode = "improve";

function selectMode(clickedBtn) {
  document.querySelectorAll(".mode-btn").forEach(btn => btn.classList.remove("active"));
  clickedBtn.classList.add("active");
  currentMode = clickedBtn.dataset.mode;

  const langPicker = document.getElementById("langPicker");
  if (currentMode === "translate") {
    langPicker.classList.add("show");
  } else {
    langPicker.classList.remove("show");
  }

  document.getElementById("outputSection").style.display = "none";
  document.getElementById("errorBox").style.display = "none";
}

function buildPrompt(userText) {
  const lang = document.getElementById("langSelect").value;

  const prompts = {
    improve:   `You are a professional writing editor. Improve the following text to make it clearer, more engaging, and stronger. Fix grammar, improve word choice, and enhance flow. Return ONLY the improved text, no explanation.\n\nText:\n${userText}`,
    summarize: `You are an expert at summarizing. Summarize the following text into clear, concise bullet points that capture all key ideas. Return ONLY the bullet points, no introduction.\n\nText:\n${userText}`,
    formal:    `You are a business writing expert. Rewrite the following text in a formal, professional tone suitable for business or academic settings. Return ONLY the rewritten text.\n\nText:\n${userText}`,
    casual:    `You are a friendly writing coach. Rewrite the following text in a casual, warm, conversational tone — like talking to a friend. Return ONLY the rewritten text.\n\nText:\n${userText}`,
    expand:    `You are a skilled writer. Expand the following text by adding more detail, examples, and depth while keeping the original meaning. Make it richer and more informative. Return ONLY the expanded text.\n\nText:\n${userText}`,
    translate: `Translate the following text to ${lang}. Return ONLY the translation, nothing else.\n\nText:\n${userText}`,
  };

  return prompts[currentMode];
}

async function runAI() {
  const inputText = document.getElementById("inputText").value.trim();

  if (!inputText) {
    showError("Please enter some text first!");
    return;
  }

  if (API_KEY === "PASTE_YOUR_HF_TOKEN_HERE") {
    showError("Please add your Hugging Face token inside app.js (line 6). It starts with hf_...");
    return;
  }

  setLoading(true);
  document.getElementById("outputSection").style.display = "none";
  document.getElementById("errorBox").style.display = "none";

  const prompt = buildPrompt(inputText);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content;

    document.getElementById("outputText").textContent = resultText;
    document.getElementById("outputSection").style.display = "block";
    document.getElementById("outputSection").scrollIntoView({ behavior: "smooth", block: "start" });

  } catch (error) {
    showError("Error: " + error.message);
  } finally {
    setLoading(false);
  }
}

function showError(message) {
  const errorBox = document.getElementById("errorBox");
  document.getElementById("errorMsg").textContent = message;
  errorBox.style.display = "block";
}

function setLoading(isLoading) {
  const btn = document.getElementById("runBtn");
  const btnText = btn.querySelector(".btn-text");
  const btnLoading = btn.querySelector(".btn-loading");
  btn.disabled = isLoading;
  btnText.style.display = isLoading ? "none" : "inline";
  btnLoading.style.display = isLoading ? "inline" : "none";
}

function updateCharCount() {
  const text = document.getElementById("inputText").value;
  document.getElementById("charCount").textContent = `${text.length} characters`;
}

function copyResult() {
  const text = document.getElementById("outputText").textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector(".copy-btn");
    btn.textContent = "Copied! ✓";
    btn.style.color = "var(--success)";
    btn.style.borderColor = "var(--success)";
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.style.color = "";
      btn.style.borderColor = "";
    }, 2000);
  });
}

function clearAll() {
  document.getElementById("inputText").value = "";
  document.getElementById("charCount").textContent = "0 characters";
  document.getElementById("outputSection").style.display = "none";
  document.getElementById("errorBox").style.display = "none";
}
