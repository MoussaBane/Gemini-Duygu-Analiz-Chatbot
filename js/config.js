/**
 * Environment Configuration Loader
 * Simplified version with better fallback support
 */

class EnvironmentConfig {
  constructor() {
    this.config = {};
    this.loadDefaults();
  }

  /**
   * Load environment variables (simplified for client-side)
   */
  async loadEnvironmentVariables() {
    // For client-side, we'll use defaults and allow manual override
    this.loadDefaults();
    return this.config;
  }

  /**
   * Load default configuration
   */
  loadDefaults() {
    this.config = {
      GEMINI_API_KEY: 'BURAYA_API_ANAHTARINIZI_YAPISTIIRIN',
      GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      APP_NAME: 'Gemini Duygu Analiz Chatbot',
      APP_VERSION: '1.0.0',
      ENABLE_SPEECH_TO_TEXT: true,
      ENABLE_DEEP_ANALYSIS: true,
      ENABLE_CHAT_HISTORY: true,
      DEFAULT_THEME: 'light',
      API_RATE_LIMIT: 60,
      API_RATE_WINDOW: 60000,
      DEBUG_MODE: false,
      CONSOLE_LOGGING: true
    };
  }

  /**
   * Get environment variable value
   */
  get(key, defaultValue = null) {
    return this.config[key] !== undefined ? this.config[key] : defaultValue;
  }

  /**
   * Set environment variable value
   */
  set(key, value) {
    this.config[key] = value;
  }

  /**
   * Get all configuration
   */
  getAll() {
    return { ...this.config };
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featureName) {
    return this.get(featureName, false) === true;
  }

  /**
   * Get API configuration
   */
  getApiConfig() {
    return {
      apiKey: this.get('GEMINI_API_KEY'),
      apiUrl: this.get('GEMINI_API_URL'),
      rateLimit: this.get('API_RATE_LIMIT'),
      rateWindow: this.get('API_RATE_WINDOW')
    };
  }

  /**
   * Get app configuration
   */
  getAppConfig() {
    return {
      name: this.get('APP_NAME'),
      version: this.get('APP_VERSION'),
      defaultTheme: this.get('DEFAULT_THEME'),
      debugMode: this.get('DEBUG_MODE'),
      consoleLogging: this.get('CONSOLE_LOGGING')
    };
  }
}

// Export for use in other modules
window.EnvironmentConfig = EnvironmentConfig;
