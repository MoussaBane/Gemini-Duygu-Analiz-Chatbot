// ================================
// GEMINI DUYGU ANALIZ CHATBOT
// Production Version
// ================================

class GeminiChatbot {
  constructor() {
    this.config = null;
    this.API_KEY = null;
    this.API_URL = null;
    this.isDeepAnalysis = false;
    this.recognition = null;
    this.isRecording = false;
    this.chatHistory = [];

    this.initializeConfig();
  }

  async initializeConfig() {
    try {
      // Initialize environment configuration
      this.config = new EnvironmentConfig();

      // Get API key from config
      this.API_KEY = this.config.get("GEMINI_API_KEY");

      // Check if API key is valid
      if (!this.API_KEY || this.API_KEY === "YOUR_API_KEY_HERE") {
        this.showApiNotice();
        console.warn("Please set your API key in js/config.js");
        return;
      }

      this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`;
    } catch (error) {
      console.warn("Environment config failed, using defaults:", error);
      this.config = {
        get: (key, defaultValue) => defaultValue,
        isFeatureEnabled: () => true,
        getAppConfig: () => ({
          defaultTheme: "light",
          name: "Gemini Duygu Analiz Chatbot",
        }),
      };
    }

    // Initialize app
    this.init();
  }

  init() {
    this.loadHistory();
    this.initializeSpeechRecognition();
    this.bindEvents();
    this.applyConfiguration();
    if (this.API_KEY && this.API_KEY !== "YOUR_API_KEY_HERE") {
      this.hideApiNotice();
    }
  }

  showApiNotice() {
    const notice = document.getElementById("apiNotice");
    if (notice) {
      notice.classList.add("show");
    }
  }

  hideApiNotice() {
    const notice = document.getElementById("apiNotice");
    if (notice) {
      notice.classList.remove("show");
    }
  }

  applyConfiguration() {
    try {
      const appConfig = this.config.getAppConfig
        ? this.config.getAppConfig()
        : { defaultTheme: "light" };

      // Set default theme
      if (appConfig.defaultTheme === "dark") {
        document.body.classList.add("dark");
      }

      // Enable/disable features based on config
      if (this.config.isFeatureEnabled) {
        if (!this.config.isFeatureEnabled("ENABLE_SPEECH_TO_TEXT")) {
          const voiceBtn = document.getElementById("voiceBtn");
          if (voiceBtn) voiceBtn.style.display = "none";
        }

        if (!this.config.isFeatureEnabled("ENABLE_DEEP_ANALYSIS")) {
          const deepAnalysisBtn = document.getElementById("deepAnalysisToggle");
          if (deepAnalysisBtn) deepAnalysisBtn.style.display = "none";
        }

        if (!this.config.isFeatureEnabled("ENABLE_CHAT_HISTORY")) {
          const clearHistoryBtn = document.getElementById("clearHistory");
          if (clearHistoryBtn) clearHistoryBtn.style.display = "none";
        }
      }

      // Set app title if needed
      if (appConfig.name) {
        document.title = appConfig.name;
      }
    } catch (error) {
      console.warn("Configuration application failed:", error);
    }
  }

  // Event Listeners
  bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById("toggleTheme");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Deep analysis toggle
    const deepAnalysisBtn = document.getElementById("deepAnalysisToggle");
    if (deepAnalysisBtn) {
      deepAnalysisBtn.addEventListener("click", () =>
        this.toggleDeepAnalysis()
      );
    }

    // Clear history
    const clearHistoryBtn = document.getElementById("clearHistory");
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener("click", () => this.clearHistory());
    }

    // Voice toggle
    const voiceBtn = document.getElementById("voiceBtn");
    if (voiceBtn) {
      voiceBtn.addEventListener("click", () => this.toggleVoice());
    }

    // Send message
    const sendBtn = document.getElementById("sendBtn");
    if (sendBtn) {
      sendBtn.addEventListener("click", () => this.sendMessage());
    }

    // Enter key handler
    const userInput = document.getElementById("userInput");
    if (userInput) {
      userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.sendMessage();
      });
    }

    // Logo click to zoom
    const logoContainer = document.querySelector(".logo-container");
    if (logoContainer) {
      logoContainer.addEventListener("click", () => this.toggleLogoZoom());
    }

    // Test sentence buttons - will be bound after DOM content loaded
    this.bindTestButtons();
  }

  // Bind test button events
  bindTestButtons() {
    // Wait for test buttons to be created, then bind events
    setTimeout(() => {
      document.querySelectorAll(".test-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const sentence = e.target.dataset.sentence;
          this.useTestSentence(sentence);
        });
      });
    }, 100);
  }

  // Logging utility
  log(message, type = "info") {
    try {
      const shouldLog =
        this.config && this.config.get
          ? this.config.get("CONSOLE_LOGGING", true)
          : true;

      if (shouldLog) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;

        switch (type) {
          case "error":
            console.error(logMessage);
            break;
          case "warn":
            console.warn(logMessage);
            break;
          case "debug":
            const debugMode =
              this.config && this.config.get
                ? this.config.get("DEBUG_MODE", false)
                : false;
            if (debugMode) {
              console.log(logMessage);
            }
            break;
          default:
            console.log(logMessage);
        }
      }
    } catch (error) {
      console.log(`[FALLBACK] ${message}`);
    }
  }

  // Speech Recognition
  initializeSpeechRecognition() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "tr-TR";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById("userInput").value = text;
        this.stopRecording();
      };

      this.recognition.onerror = (event) => {
        console.error("Ses tanıma hatası:", event.error);
        this.stopRecording();
      };

      this.recognition.onend = () => {
        this.stopRecording();
      };
    }
  }

  toggleVoice() {
    if (!this.recognition) {
      alert("Tarayıcınız ses tanımayı desteklemiyor.");
      return;
    }

    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    this.recognition.start();
    this.isRecording = true;
    const voiceBtn = document.getElementById("voiceBtn");
    if (voiceBtn) {
      voiceBtn.textContent = "🔴";
      voiceBtn.classList.add("recording");
    }
  }

  stopRecording() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
    this.isRecording = false;
    const voiceBtn = document.getElementById("voiceBtn");
    if (voiceBtn) {
      voiceBtn.textContent = "🎤";
      voiceBtn.classList.remove("recording");
    }
  }

  toggleTheme() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Update theme button icon
    const themeBtn = document.getElementById("toggleTheme");
    if (themeBtn) {
      themeBtn.textContent = isDark ? "☀️" : "🌗";
    }
  }

  toggleDeepAnalysis() {
    this.isDeepAnalysis = !this.isDeepAnalysis;
    const analysisMode = document.getElementById("analysisMode");
    const deepAnalysisBtn = document.getElementById("deepAnalysisToggle");

    if (analysisMode) {
      analysisMode.textContent = this.isDeepAnalysis ? "Açık" : "Kapalı";
    }

    if (deepAnalysisBtn) {
      deepAnalysisBtn.classList.toggle("active", this.isDeepAnalysis);
    }

    localStorage.setItem("deepAnalysis", this.isDeepAnalysis);
  }

  clearHistory() {
    if (confirm("Sohbet geçmişini silmek istediğinizden emin misiniz?")) {
      this.chatHistory = [];
      const messagesContainer = document.getElementById("messages");
      if (messagesContainer) {
        messagesContainer.innerHTML = "";
      }
      localStorage.removeItem("chatHistory");
      this.log("Chat history cleared", "info");
    }
  }

  toggleLogoZoom() {
    const logoContainer = document.querySelector(".logo-container");
    if (logoContainer) {
      logoContainer.classList.toggle("zoomed");

      // Auto remove zoom after 2 seconds
      if (logoContainer.classList.contains("zoomed")) {
        setTimeout(() => {
          logoContainer.classList.remove("zoomed");
        }, 2000);
      }
    }
  }

  useTestSentence(sentence) {
    document.getElementById("userInput").value = sentence;
    document.getElementById("userInput").focus();
  }

  async sendMessage() {
    if (!this.API_KEY || this.API_KEY === "YOUR_API_KEY_HERE") {
      this.showApiNotice();
      alert("Lütfen config.js dosyasında API anahtarınızı ayarlayın.");
      return;
    }

    const userInput = document.getElementById("userInput");
    const message = userInput.value.trim();

    if (!message) return;

    // Clear input and add user message
    userInput.value = "";
    this.appendMessage(message, "user");

    // Show loading
    this.appendMessage("💭 Düşünüyor...", "bot", true);
    this.setLogoThinking(true);

    try {
      const prompt = this.buildPrompt(message);

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "Cevap alınamadı.";

      this.removeLastBotMessage();
      this.appendMessage(reply, "bot");
      this.saveToLocalStorage();
    } catch (error) {
      this.log(`API Hatası: ${error.message}`, "error");
      this.removeLastBotMessage();

      let errorMessage = "❌ Bağlantı hatası. ";
      if (error.message.includes("404")) {
        errorMessage += "API endpoint bulunamadı.";
      } else if (
        error.message.includes("401") ||
        error.message.includes("403")
      ) {
        errorMessage +=
          "API anahtarı geçersiz. Lütfen config.js dosyasında yeni bir API anahtarı ayarlayın.";
      } else if (error.message.includes("429")) {
        errorMessage += "Çok fazla istek gönderildi. Lütfen biraz bekleyin.";
      } else {
        errorMessage += "Lütfen API anahtarınızı kontrol edin.";
      }

      this.appendMessage(errorMessage, "bot");
    } finally {
      this.setLogoThinking(false);
    }
  }

  buildPrompt(message) {
    const basePrompt = `Sen bir duygu analizi uzmanısın. Verilen metindeki duyguları analiz et ve aşağıdaki formatta cevap ver:

🎯 **Duygu Analizi**
- **Ana Duygu**: [pozitif/negatif/nötr]
- **Duygu Yoğunluğu**: [zayıf/orta/güçlü]
- **Tespit Edilen Duygular**: [mutluluk, üzüntü, öfke, korku, şaşkınlık, iğrenme vb.]

📊 **Detaylı Analiz**
- **Ton**: [Metnin genel tonu]
- **Bağlam**: [Metnin yazıldığı muhtemel durum]
- **Anahtar Kelimeler**: [Duyguyu belirten önemli kelimeler]

${
  this.isDeepAnalysis
    ? `
🧠 **Derin Analiz**
- **Psikolojik Durum**: [Yazarın muhtemel psikolojik durumu]
- **Motivasyon**: [Metni yazma amacı]
- **Öneriler**: [Duygu durumuna göre öneriler]
`
    : ""
}

💬 **Özet**: [Analiz özeti ve genel değerlendirme]

Analiz edilecek metin: "${message}"`;

    return basePrompt;
  }

  appendMessage(message, sender, isTemporary = false) {
    const messagesContainer = document.getElementById("messages");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);

    if (isTemporary) {
      messageDiv.classList.add("temporary");
    }

    // Format message with markdown-like styling
    const formattedMessage = this.formatMessage(message);
    messageDiv.innerHTML = formattedMessage;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Add to chat history if not temporary
    if (!isTemporary) {
      this.chatHistory.push({ message, sender, timestamp: Date.now() });
    }
  }

  formatMessage(message) {
    return message
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  removeLastBotMessage() {
    const messagesContainer = document.getElementById("messages");
    const lastMessage = messagesContainer.lastElementChild;
    if (lastMessage && lastMessage.classList.contains("temporary")) {
      messagesContainer.removeChild(lastMessage);
    }
  }

  saveToLocalStorage() {
    localStorage.setItem("chatHistory", JSON.stringify(this.chatHistory));
  }

  loadHistory() {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      try {
        this.chatHistory = JSON.parse(savedHistory);
        this.chatHistory.forEach((item) => {
          this.appendMessage(item.message, item.sender);
        });
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    }

    // Load saved settings
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    }

    const savedDeepAnalysis = localStorage.getItem("deepAnalysis");
    if (savedDeepAnalysis === "true") {
      this.isDeepAnalysis = true;
      const analysisMode = document.getElementById("analysisMode");
      const deepAnalysisBtn = document.getElementById("deepAnalysisToggle");

      if (analysisMode) analysisMode.textContent = "Açık";
      if (deepAnalysisBtn) deepAnalysisBtn.classList.add("active");
    }
  }

  setLogoThinking(isThinking) {
    const logoContainer = document.querySelector(".logo-container");
    if (logoContainer) {
      logoContainer.classList.toggle("thinking", isThinking);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.chatbot = new GeminiChatbot();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GeminiChatbot };
}
