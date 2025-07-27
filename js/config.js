/**
 * Environment Configuration Loader
 * Loads environment variables from .env file for client-side use
 */

class EnvironmentConfig {
  constructor() {
    this.config = {};
    this.loadEnvironmentVariables();
  }

  /**
   * Load environment variables from .env file
   * Note: In production, consider using a build process to inject these
   */
  async loadEnvironmentVariables() {
    try {
      // For client-side, we'll use a simple approach
      // In production, these should be injected during build time
      const response = await fetch('.env');
      const envText = await response.text();
      this.parseEnvFile(envText);
    } catch (error) {
      console.warn('Environment file not found, using defaults');
      this.loadDefaults();
    }
  }

  /**
   * Parse .env file content
   */
  parseEnvFile(envText) {
    const lines = envText.split('\n');
    lines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        this.config[key.trim()] = this.parseValue(value);
      }
    });
  }

  /**
   * Parse environment value (handle booleans, numbers, etc.)
   */
  parseValue(value) {
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse boolean values
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;

    // Parse numeric values
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
      return parseFloat(value);
    }

    return value;
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
