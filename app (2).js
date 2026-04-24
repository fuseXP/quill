// ============================================================
//  Quill — AI Writing Assistant
//  Powered by Hugging Face Inference API
// ============================================================

const MODEL   = "moonshotai/Kimi-K2-Instruct-0905";
const API_URL = "https://router.huggingface.co/v1/chat/completions";

let currentMode = "improve";

// ============================================================
//  TOKEN MANAGEMENT
//  Saves the user's HF token in browser memory (sessionStorage)
//  so they only have to type it once per session.
// ============================================================
function saveToken() {
  const token = document.getElementById("tokenInput").value.trim();

  if (!token.startsWith("hf_")) {
    alert("That doesn't look right — your token should start with hf_");
    return;
  }

  // Save token in sessionStorage (cleared when browser tab closes)
  sessionStorage.setItem("hf_token", token);

  // Show the "token active" banner, hide the input section
  document.getElementById("tokenSection").style.display = "none";
  document.getElementById("tokenSaved").style.display = "flex";
}

function changeToken() {
  // Remove saved token and show input again
  sessionStorage.removeItem("hf_token");
  document.getElementById("tokenSection").style.display = "block";
  document.getElementById("tokenSaved").style.display = "none";
  document.getElementById("tokenInput").value = "";
}

function getToken() {
  return sessionStorage.getItem("hf_token");
}

// Check on page load if token already saved this session
window.addEventListener("load", () => {
  if (getToken()) {
    document.getElementById("tokenSection").style.display = "none";
    document.getElementById("tokenSaved").style.display = "flex";
  }
});

// ============================================================
//  selectMode
// ============================================================
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

// ============================================================
//  buildPrompt
// ============================================================
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

// ============================================================
//  runAI
// ============================================================
async function runAI() {
  const inputText = document.getElementById("inputText").value.trim();
  const token = getToken();

  if (!token) {
    showError("Please enter your Hugging Face token first!");
    document.getElementById("tokenSection").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (!inputText) {
    showError("Please enter some text first!");
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
        "Authorization": `Bearer ${token}`
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

// ============================================================
//  HELPER FUNCTIONS
// ============================================================
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
