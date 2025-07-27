// ================================
// GEMINI DUYGU ANALIZ CHATBOT
// JavaScript Modülleri
// ================================

class GeminiChatbot {
  constructor() {
    this.config = null;
    // API anahtarınızı buraya yapıştırın:
    this.API_KEY = "AIzaSyDabpNw4_uYpaIeiezjC7zDJZGp2Dgt4qQ"; 
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
      
      // Set API configuration
      const apiConfig = this.config.getApiConfig();
      
      // Use environment API key if available and not default
      if (apiConfig.apiKey && apiConfig.apiKey !== 'BURAYA_API_ANAHTARINIZI_YAPISTIIRIN') {
        this.API_KEY = apiConfig.apiKey;
      }
      
      this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`;
      
    } catch (error) {
      console.warn('Environment config failed, using defaults:', error);
      // Use simple fallback configuration
      this.config = {
        get: (key, defaultValue) => defaultValue,
        isFeatureEnabled: () => true,
        getAppConfig: () => ({ defaultTheme: 'light', name: 'Gemini Duygu Analiz Chatbot' })
      };
      this.API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`;
    }
    
    // Initialize app
    this.init();
  }

  init() {
    this.loadHistory();
    this.initializeSpeechRecognition();
    this.bindEvents();
    this.applyConfiguration();
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
      // Continue with default behavior
    }
  }

  // Event Listeners
  bindEvents() {
    // Theme toggle
    document.getElementById('toggleTheme').addEventListener('click', () => this.toggleTheme());
    
    // Deep analysis toggle
    document.getElementById('deepAnalysisToggle').addEventListener('click', () => this.toggleDeepAnalysis());
    
    // Clear history
    document.getElementById('clearHistory').addEventListener('click', () => this.clearHistory());
    
    // Voice toggle
    document.getElementById('voiceBtn').addEventListener('click', () => this.toggleVoice());
    
    // Send message
    document.getElementById('sendBtn').addEventListener('click', () => this.sendMessage());
    
    // Enter key handler
    document.getElementById('userInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Logo click to zoom
    document.querySelector('.logo-container').addEventListener('click', () => this.toggleLogoZoom());

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
        const transcript = event.results[0][0].transcript;
        document.getElementById('userInput').value = transcript;
      };

      this.recognition.onerror = (event) => {
        console.error('Ses tanıma hatası:', event.error);
        this.stopRecording();
      };

      this.recognition.onend = () => {
        this.stopRecording();
      };
    } else {
      document.getElementById('voiceBtn').style.display = 'none';
    }
  }

  toggleVoice() {
    if (!this.recognition) return;

    if (this.isRecording) {
      this.recognition.stop();
    } else {
      this.recognition.start();
      this.startRecording();
    }
  }

  startRecording() {
    this.isRecording = true;
    const voiceBtn = document.getElementById('voiceBtn');
    voiceBtn.classList.add('recording');
    voiceBtn.innerHTML = '⏹️';
  }

  stopRecording() {
    this.isRecording = false;
    const voiceBtn = document.getElementById('voiceBtn');
    voiceBtn.classList.remove('recording');
    voiceBtn.innerHTML = '🎤';
  }

  // Theme Management
  toggleTheme() {
    document.body.classList.toggle('dark');
    this.saveToLocalStorage();
  }

  // Analysis Mode
  toggleDeepAnalysis() {
    this.isDeepAnalysis = !this.isDeepAnalysis;
    const modeSpan = document.getElementById('analysisMode');
    modeSpan.textContent = this.isDeepAnalysis ? 'Açık' : 'Kapalı';
    this.saveToLocalStorage();
  }

  // Test Sentences
  useTestSentence(sentence) {
    document.getElementById('userInput').value = sentence;
    document.getElementById('userInput').focus();
  }

  // Message Management
  async sendMessage() {
    const input = document.getElementById('userInput');
    const userMessage = input.value.trim();
    
    if (!userMessage) return;

    this.appendMessage(userMessage, 'user');
    input.value = '';
    this.appendMessage('Analiz ediliyor<span class="loading-dots"></span>', 'bot', true);
    
    // Activate logo thinking animation
    this.setLogoThinking(true);

    const prompt = this.buildPrompt(userMessage);

    try {
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
      console.log('API Response:', data);
      
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Cevap alınamadı.';
      
      this.removeLastBotMessage();
      this.appendMessage(reply, 'bot');
      this.saveToLocalStorage();
      
    } catch (error) {
      this.log(`API Hatası: ${error.message}`, "error");
      this.removeLastBotMessage();
      
      let errorMessage = '❌ Bağlantı hatası. ';
      if (error.message.includes('404')) {
        errorMessage += 'API endpoint bulunamadı.';
      } else if (error.message.includes('401')) {
        errorMessage += 'API anahtarı geçersiz.';
      } else if (error.message.includes('429')) {
        errorMessage += 'Çok fazla istek gönderildi.';
      } else {
        errorMessage += 'API anahtarınızı kontrol edin.';
      }
      
      this.appendMessage(errorMessage, 'bot error');
    } finally {
      // Deactivate logo thinking animation
      this.setLogoThinking(false);
    }
  }

  buildPrompt(userMessage) {
    return this.isDeepAnalysis ? 
      `
Aşağıdaki cümlenin DERIN DUYGU ANALİZİNİ yap:
Cümle: "${userMessage}"

Lütfen şu formatta cevap ver:
🎭 Ana Duygu: [emoji] [duygu adı] (%[güven yüzdesi])
📊 Detaylı Analiz:
- Duygusal Ton: [açıklama]
- Empati Seviyesi: [düşük/orta/yüksek]
- Psikolojik İpuçları: [gözlemler]
- Literatür Bağlantısı: [edebi/felsefi referans]

💡 Öneriler: [empati dolu öneriler]
      ` :
      `
Aşağıdaki cümlenin duygusunu analiz et ve şu formatta cevap ver:
Cümle: "${userMessage}"

Format:
😊 Duygu: [emoji] [duygu adı] (%[güven yüzdesi])
📝 Açıklama: [kısa açıklama]
      `;
  }

  appendMessage(text, sender, isTemporary = false) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = this.formatMessage(text);
    
    if (isTemporary) messageDiv.classList.add('temp');
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  formatMessage(text) {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  removeLastBotMessage() {
    const messagesDiv = document.getElementById('messages');
    const temps = messagesDiv.querySelectorAll('.bot.temp');
    if (temps.length > 0) {
      messagesDiv.removeChild(temps[temps.length - 1]);
    }
  }

  // Local Storage Management
  saveToLocalStorage() {
    const messages = document.getElementById('messages').innerHTML;
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    
    localStorage.setItem('chatHistory', messages);
    localStorage.setItem('theme', theme);
    localStorage.setItem('deepAnalysis', this.isDeepAnalysis);
  }

  loadHistory() {
    const savedMessages = localStorage.getItem('chatHistory');
    const savedTheme = localStorage.getItem('theme');
    const savedDeepAnalysis = localStorage.getItem('deepAnalysis');
    
    if (savedMessages) {
      document.getElementById('messages').innerHTML = savedMessages;
    }
    
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
    }
    
    if (savedDeepAnalysis === 'true') {
      this.isDeepAnalysis = true;
      document.getElementById('analysisMode').textContent = 'Açık';
    }
  }

  clearHistory() {
    if (confirm('Tüm sohbet geçmişini silmek istediğinizden emin misiniz?')) {
      document.getElementById('messages').innerHTML = '';
      localStorage.removeItem('chatHistory');
    }
  }

  // Logo Animation Control
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

  // Logo Zoom Toggle
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

// Test Sentences Data
const TEST_SENTENCES = [
  { emoji: '😊', label: 'Mutlu', text: 'Bugün harika bir gün! Çok mutluyum.' },
  { emoji: '😢', label: 'Üzgün', text: 'Çok üzgünüm, her şey yolunda gitmiyor.' },
  { emoji: '😠', label: 'Kızgın', text: 'Bu durum beni gerçekten sinirlendiriyor!' },
  { emoji: '😰', label: 'Endişeli', text: 'Yarın ne olacağını bilmiyorum, endişeliyim.' },
  { emoji: '😐', label: 'Nötr', text: 'Bu konuda hiçbir şey hissetmiyorum.' },
  { emoji: '🥺', label: 'Duygusal', text: 'Hayatımın en güzel anıydı, gözlerim doldu.' },
  { emoji: '😞', label: 'Umutsuz', text: 'Artık umudumu kaybettim, hiçbir şey eskisi gibi olmayacak.' },
  { emoji: '🤔', label: 'Karışık', text: 'Yeni işime başlıyorum, hem heyecanlı hem korkuyorum.' }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GeminiChatbot();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GeminiChatbot, TEST_SENTENCES };
}
