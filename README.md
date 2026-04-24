# ✦ Quill — AI Writing Assistant

> A sleek AI-powered writing tool built with vanilla HTML, CSS, and JavaScript using the Claude API.

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![Made With](https://img.shields.io/badge/made%20with-HTML%20%7C%20CSS%20%7C%20JS-orange)
![AI Powered](https://img.shields.io/badge/AI-Claude%20API-blue)

---

## 🚀 What it does

Quill lets users transform their writing in seconds using AI. Choose a mode, paste your text, and let Claude do the work:

| Mode | What it does |
|------|-------------|
| ✨ Improve | Makes writing clearer and stronger |
| 📋 Summarize | Condenses text into bullet points |
| 👔 Formalize | Converts to professional tone |
| 😊 Casualize | Makes writing friendly and relaxed |
| 📖 Expand | Adds depth and detail |
| 🌍 Translate | Converts to 9 languages |

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (no frameworks!)
- **AI:** [Anthropic Claude API](https://www.anthropic.com)
- **Fonts:** Google Fonts (Playfair Display + DM Sans)
- **Hosting:** GitHub Pages (free)

---

## ⚙️ How to run it locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/quill-ai-assistant.git
cd quill-ai-assistant
```

### 2. Get a free API key
- Go to [console.anthropic.com](https://console.anthropic.com)
- Sign up for a free account
- Create an API key

### 3. Add your API key
Open `app.js` and replace line 16:
```js
const API_KEY = "YOUR_API_KEY_HERE";
// Replace with your real key:
const API_KEY = "sk-ant-...";
```

### 4. Open in browser
Just open `index.html` in any modern browser. No server needed!

---

## 📁 Project Structure

```
quill-ai-assistant/
├── index.html   ← Page structure & UI
├── style.css    ← All styling & animations
├── app.js       ← Claude API logic & interactivity
└── README.md    ← This file
```

---

## 💡 How the AI works (for beginners)

The core of this project is **prompt engineering** — writing clear instructions for the AI.

In `app.js`, the `buildPrompt()` function creates different instructions depending on the mode selected:

```js
// Example: Improve mode
`You are a professional writing editor. Improve the following text...`

// Example: Translate mode  
`Translate the following text to ${language}. Return ONLY the translation.`
```

The instructions are sent to Claude via the API, and the response is displayed on screen. That's it!

---

## 🗺️ Roadmap (future features)

- [ ] User accounts & saved history
- [ ] Custom tone settings
- [ ] Voice input
- [ ] Dark/light mode toggle
- [ ] Export to PDF

---

## 🎯 What I learned building this

- How to call a REST API using `fetch()`
- How to handle async/await in JavaScript
- Prompt engineering basics
- Building responsive UIs with CSS Grid
- Error handling in real apps

---

## 👤 Author

Built by **[Your Name]** as part of learning AI development.

*"Every expert was once a beginner."*

---

## 📄 License

MIT — feel free to use and modify!
