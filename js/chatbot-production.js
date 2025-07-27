// ================================
// GEMINI DUYGU ANALIZ CHATBOT
// Production Version
// ================================

class GeminiChatbot {
  constructor() {
    this.config = null;
    this.API_KEY = localStorage.getItem('gemini_api_key') || null;
    this.API_URL = null;
    this.isDeepAnalysis = false;
    this.recognition = null;
    this.isRecording = false;
    
    this.initializeConfig();
  }

  async initializeConfig() {
    try {
      // Initialize environment configuration
      this.config = new EnvironmentConfig();
      
      // Check if API key is available
      if (!this.API_KEY || this.API_KEY === 'BURAYA_API_ANAHTARINIZI_YAPISTIIRIN') {
        this.showApiKeyModal();
        return;
      }
      
      this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`;
      
    } catch (error) {
      console.warn('Environment config failed, using defaults:', error);
      this.config = {
        get: (key, defaultValue) => defaultValue,
        isFeatureEnabled: () => true,
        getAppConfig: () => ({ defaultTheme: 'light', name: 'Gemini Duygu Analiz Chatbot' })
      };
      
      if (this.API_KEY) {
        this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`;
      }
    }
    
    // Initialize app
    this.init();
  }

  init() {
    this.loadHistory();
    this.initializeSpeechRecognition();
    this.bindEvents();
    this.applyConfiguration();
    this.hideApiNotice();
  }

  // Show API key modal
  showApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    
    if (modal) {
      modal.style.display = 'flex';
      modal.classList.add('show');
      
      // Focus on input
      const input = document.getElementById('apiKeyInput');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }

  hideApiNotice() {
    const notice = document.getElementById('apiNotice');
    if (notice) {
      notice.classList.remove('show');
    }
  }

  // Save API key
  saveApiKey(apiKey) {
    // If no parameter passed, get from input
    if (!apiKey) {
      const input = document.getElementById('apiKeyInput');
      apiKey = input ? input.value.trim() : '';
    }
    
    if (!apiKey || apiKey.length < 30) {
      alert('Lütfen geçerli bir API anahtarı girin.');
      return false;
    }
    
    // Save API key
    this.API_KEY = apiKey;
    localStorage.setItem('gemini_api_key', this.API_KEY);
    this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`;
    
    // Hide modal
    const modal = document.getElementById('apiKeyModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
    
    // Clear input
    const input = document.getElementById('apiKeyInput');
    if (input) {
      input.value = '';
    }
    
    // Hide notice
    this.hideApiNotice();
    
    // Show success message
    alert('API anahtarı başarıyla kaydedildi! Artık chatbot\'u kullanabilirsiniz.');
    
    // Initialize if not already done
    if (!this.config) {
      this.initializeConfig();
    } else {
      this.init();
    }
    
    this.log('API key saved successfully', 'info');
    return true;
  }

  applyConfiguration() {
    try {
      const appConfig = this.config.getAppConfig ? this.config.getAppConfig() : { defaultTheme: 'light' };
      
      // Set default theme
      if (appConfig.defaultTheme === 'dark') {
        document.body.classList.add('dark');
      }
      
      // Enable/disable features based on config (only if config is available)
      if (this.config.isFeatureEnabled) {
        if (!this.config.isFeatureEnabled('ENABLE_SPEECH_TO_TEXT')) {
          const voiceBtn = document.getElementById('voiceBtn');
          if (voiceBtn) voiceBtn.style.display = 'none';
        }
        
        if (!this.config.isFeatureEnabled('ENABLE_DEEP_ANALYSIS')) {
          const deepAnalysisBtn = document.getElementById('deepAnalysisToggle');
          if (deepAnalysisBtn) deepAnalysisBtn.style.display = 'none';
        }
        
        if (!this.config.isFeatureEnabled('ENABLE_CHAT_HISTORY')) {
          const clearHistoryBtn = document.getElementById('clearHistory');
          if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
        }
      }
      
      // Set app title if needed
      if (appConfig.name) {
        document.title = appConfig.name;
      }
    } catch (error) {
      console.warn('Configuration application failed:', error);
    }
  }

  // Event Listeners
  bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('toggleTheme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }
    
    // Deep analysis toggle
    const deepAnalysisBtn = document.getElementById('deepAnalysisToggle');
    if (deepAnalysisBtn) {
      deepAnalysisBtn.addEventListener('click', () => this.toggleDeepAnalysis());
    }
    
    // Clear history
    const clearHistoryBtn = document.getElementById('clearHistory');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }
    
    // API key button
    const apiKeyBtn = document.getElementById('apiKeyBtn');
    if (apiKeyBtn) {
      apiKeyBtn.addEventListener('click', () => this.showApiKeyModal());
    }
    
    // Voice toggle
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => this.toggleVoice());
    }
    
    // Send message
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.sendMessage());
    }
    
    // Enter key handler
    const userInput = document.getElementById('userInput');
    if (userInput) {
      userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }

    // Logo click to zoom
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
      logoContainer.addEventListener('click', () => this.toggleLogoZoom());
    }

    // API Key Modal events
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const cancelApiKeyBtn = document.getElementById('cancelApiKey');
    const apiKeyInput = document.getElementById('apiKeyInput');
    
    if (saveApiKeyBtn) {
      saveApiKeyBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput ? apiKeyInput.value : '';
        if (this.saveApiKey(apiKey)) {
          if (apiKeyInput) apiKeyInput.value = '';
        } else {
          alert('Lütfen geçerli bir API anahtarı girin.');
        }
      });
    }
    
    if (cancelApiKeyBtn) {
      cancelApiKeyBtn.addEventListener('click', () => {
        const modal = document.getElementById('apiKeyModal');
        if (modal) {
          modal.style.display = 'none';
          modal.classList.remove('show');
        }
        // Clear input
        if (apiKeyInput) {
          apiKeyInput.value = '';
        }
      });
    }

    // Modal outside click and escape key
    const modal = document.getElementById('apiKeyModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          modal.classList.remove('show');
          if (apiKeyInput) apiKeyInput.value = '';
        }
      });
    }

    // Enter key in API input
    if (apiKeyInput) {
      apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const apiKey = apiKeyInput.value;
          if (this.saveApiKey(apiKey)) {
            apiKeyInput.value = '';
          }
        }
      });
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('apiKeyModal');
        if (modal && modal.style.display !== 'none') {
          modal.style.display = 'none';
          modal.classList.remove('show');
          if (apiKeyInput) apiKeyInput.value = '';
        }
      }
    });

    // Test sentence buttons - will be bound after DOM content loaded
    this.bindTestButtons();
  }

  // Bind test button events
  bindTestButtons() {
    // Wait for test buttons to be created, then bind events
    setTimeout(() => {
      document.querySelectorAll('.test-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const sentence = e.target.dataset.sentence;
          this.useTestSentence(sentence);
        });
      });
    }, 100);
  }

  // Logging utility
  log(message, type = 'info') {
    try {
      const shouldLog = this.config && this.config.get ? this.config.get('CONSOLE_LOGGING', true) : true;
      
      if (shouldLog) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
        
        switch (type) {
          case 'error':
            console.error(logMessage);
            break;
          case 'warn':
            console.warn(logMessage);
            break;
          case 'debug':
            const debugMode = this.config && this.config.get ? this.config.get('DEBUG_MODE', false) : false;
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
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'tr-TR';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById('userInput').value = text;
        this.stopRecording();
      };

      this.recognition.onerror = (event) => {
        console.error('Ses tanıma hatası:', event.error);
        this.stopRecording();
      };

      this.recognition.onend = () => {
        this.stopRecording();
      };
    }
  }

  toggleVoice() {
    if (!this.recognition) {
      alert('Tarayıcınız ses tanımayı desteklemiyor.');
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
    document.getElementById('voiceBtn').style.background = '#ef4444';
  }

  stopRecording() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
    this.isRecording = false;
    document.getElementById('voiceBtn').style.background = '';
  }

  toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  }

  toggleDeepAnalysis() {
    this.isDeepAnalysis = !this.isDeepAnalysis;
    document.getElementById('analysisMode').textContent = this.isDeepAnalysis ? 'Açık' : 'Kapalı';
    document.getElementById('deepAnalysisToggle').classList.toggle('active', this.isDeepAnalysis);
  }

  useTestSentence(sentence) {
    document.getElementById('userInput').value = sentence;
    document.getElementById('userInput').focus();
  }

  async sendMessage() {
    if (!this.API_KEY) {
      this.showApiKeyModal();
      return;
    }

    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (!message) return;

    // Clear input and add user message
    userInput.value = '';
    this.appendMessage(message, 'user');
    
    // Show loading
    this.appendMessage('💭 Düşünüyor...', 'bot', true);
    this.setLogoThinking(true);
    
    try {
      const prompt = this.buildPrompt(message);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Cevap alınamadı.';
      
      this.removeLastBotMessage();
      this.appendMessage(reply, 'bot');
      this.saveToLocalStorage();
      
    } catch (error) {
      this.log(`API Hatası: ${error.message}`, 'error');
      this.removeLastBotMessage();
      
      let errorMessage = '❌ Bağlantı hatası. ';
      if (error.message.includes('404')) {
        errorMessage += 'API endpoint bulunamadı.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage += 'API anahtarı geçersiz. Lütfen yeni bir API anahtarı ekleyin.';
        // Clear invalid API key
        localStorage.removeItem('gemini_api_key');
        this.API_KEY = null;
      } else if (error.message.includes('429')) {
        errorMessage += 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.';
      } else {
        errorMessage += 'Lütfen API anahtarınızı kontrol edin.';
      }
      
      this.appendMessage(errorMessage, 'bot');
    } finally {
      this.setLogoThinking(false);
    }
  }

  buildPrompt(userMessage) {
    const basePrompt = `Sen bir duygu analiz uzmanısın. Verilen metni analiz et ve şu formatta yanıtla:

DUYGU: [Ana duygu]
EMOJİ: [Uygun emoji] 
GÜVEN: [%0-100 arası]
ANALİZ: [Kısa açıklama]

${this.isDeepAnalysis ? `
DERIN ANALİZ:
- Empati Seviyesi: [Düşük/Orta/Yüksek]
- Psikolojik İpuçları: [Kısa analiz]
- Öneriler: [Varsa öneriler]
- Edebi Referans: [Varsa benzer eser/şarkı]` : ''}

Analiz edilecek metin: "${userMessage}"`;

    return basePrompt;
  }

  appendMessage(text, sender, isTemporary = false) {
    const messagesContainer = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}${isTemporary ? ' temporary' : ''}`;
    messageDiv.innerHTML = this.formatMessage(text);
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  formatMessage(text) {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  removeLastBotMessage() {
    const messages = document.querySelectorAll('.message.bot.temporary');
    if (messages.length > 0) {
      messages[messages.length - 1].remove();
    }
  }

  saveToLocalStorage() {
    const messages = document.getElementById('messages').innerHTML;
    localStorage.setItem('chatHistory', messages);
  }

  loadHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      document.getElementById('messages').innerHTML = savedHistory;
      const messagesContainer = document.getElementById('messages');
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Load theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }
  }

  clearHistory() {
    if (confirm('Sohbet geçmişini silmek istediğinizden emin misiniz?')) {
      document.getElementById('messages').innerHTML = '';
      localStorage.removeItem('chatHistory');
    }
  }

  setLogoThinking(isThinking) {
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
      if (isThinking) {
        logoContainer.classList.add('thinking');
      } else {
        logoContainer.classList.remove('thinking');
      }
    }
  }

  toggleLogoZoom() {
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
      logoContainer.classList.toggle('zoomed');
      
      // Auto remove zoom after 2 seconds
      if (logoContainer.classList.contains('zoomed')) {
        setTimeout(() => {
          logoContainer.classList.remove('zoomed');
        }, 2000);
      }
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GeminiChatbot();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GeminiChatbot };
}
