# 🤖 Gemini Duygu Analiz Chatbot

Modern ve responsive tasarıma sahip gelişmiş duygu analizi chatbot'u. Gemini AI kullanarak metinlerdeki duyguları analiz eder.

## ✨ Özellikler

- **🎯 Duygu Analizi**: Detaylı duygu tespiti ve yoğunluk analizi
- **🧠 Derin Analiz Modu**: Psikolojik durum, motivasyon ve öneriler
- **💾 Geçmiş Kaydetme**: localStorage ile otomatik sohbet geçmişi
- **🎤 Sesle Yazma**: Speech-to-Text teknolojisi ile sesli mesaj
- **🌗 Tema Desteği**: Açık/Koyu tema değiştirici
- **📱 Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **🧪 Test Cümleleri**: Farklı duygu durumları için hazır örnekler
- **✨ Animasyonlu Logo**: Tıklanabilir efektler ve sürekli animasyon

## 🚀 Kurulum

### 1. Proje Dosyalarını İndirin
```bash
git clone https://github.com/MoussaBane/Gemini-Duygu-Analiz-Chatbot.git
cd Gemini-Duygu-Analiz-Chatbot
```

### 2. API Anahtarı Alın
1. [Google AI Studio](https://aistudio.google.com/)'ya giriş yapın
2. "Get API Key" bölümünden yeni bir API anahtarı oluşturun
3. API anahtarınızı kopyalayın

### 3. API Anahtarını Yapılandırın

**📁 Config Dosyası ile (Önerilen)**

1. `js/config.example.js` dosyasını `js/config.js` olarak kopyalayın:

```bash
# Windows
copy js\config.example.js js\config.js

# Mac/Linux
cp js/config.example.js js/config.js
```

2. `js/config.js` dosyasında API anahtarınızı ekleyin:

```javascript
GEMINI_API_KEY: "your_actual_api_key_here"
```

**⚠️ Önemli**: `config.js` dosyası Git'e commit edilmez (güvenlik için).

### 4. Logo Dosyasını Ekleyin (İsteğe Bağlı)
Logo dosyanızı `assets/images/` klasörüne `logo.png` adıyla kaydedin.

**Logo Gereksinimleri:**
- Format: PNG (transparan arkaplan önerilir)
- Boyut: 512x512px veya üzeri (kare format)
- Dosya boyutu: 1MB altında

### 5. Projeyi Çalıştırın
- **VS Code Live Server** (Önerilen): Live Server extension'ı kullanın
- **Python ile**: `python -m http.server 8000`
- **Node.js ile**: `npx serve .`

## 📁 Proje Yapısı

```
Gemini-Duygu-Analiz-Chatbot/
├── index.html                 # Ana sayfa
├── index-production.html      # Production versiyonu
├── .env                      # Environment variables (local)
├── .gitignore               # Git ignore kuralları
├── assets/
│   └── images/
│       └── logo.png         # Proje logosu
├── css/
│   └── styles.css           # Modern CSS stilleri
├── js/
│   ├── config.js           # API yapılandırması (Git'e dahil değil)
│   ├── config.example.js   # Config şablonu
│   ├── chatbot.js          # Ana JavaScript dosyası
│   └── chatbot-production.js # Production JavaScript
└── README.md               # Bu dosya
```

## 🎨 Tasarım Özellikleri

### Modern UI/UX
- **Glassmorphism**: Cam efektli modern tasarım
- **Smooth Animasyonlar**: Yumuşak geçiş efektleri
- **Gradient Renkler**: Canlı renk geçişleri
- **Derinlik Efektleri**: Box-shadow ile 3D görünüm

### Logo Animasyonları
- **Float Animasyonu**: Sürekli yumuşak hareket
- **Thinking Efekti**: AI düşünürken sallanma
- **Hover Büyütme**: Mouse ile etkileşim
- **Click Zoom**: Tıklama ile yakınlaştırma
- **Glow Efekti**: Parlama animasyonu
- **Fallback**: Logo yüklenemezse emoji

### Tema Sistemi
- **Minimal Tasarım**: Header'da kompakt buton
- **Otomatik Kayıt**: Tema tercihi localStorage'da
- **Smooth Geçiş**: Yumuşak renk değişimi
- **Responsive**: Tüm cihazlarda optimize

## 📖 Kullanım Kılavuzu

### Temel Analiz
1. Metin kutusuna cümlenizi yazın
2. "Gönder" butonuna tıklayın veya Enter'a basın
3. AI analizini görüntüleyin

### Derin Analiz
1. "🧠 Derin Analiz" butonunu aktifleştirin
2. Metninizi gönderin
3. Detaylı psikolojik analizi inceleyin

### Sesle Yazma
1. 🎤 mikrofon butonuna tıklayın
2. Konuşmaya başlayın (Türkçe)
3. Metin otomatik olarak yazılacak

### Test Cümleleri
- 8 farklı duygu kategorisi
- Tek tıkla metin kutusuna ekleme
- Hızlı test için hazır örnekler

## 🛠️ Teknolojiler

### Frontend
- **HTML5**: Semantic yapı
- **CSS3**: Modern stillendirme
- **Vanilla JavaScript**: Saf JavaScript (framework yok)

### AI & API
- **Google Gemini 1.5 Flash**: Gelişmiş dil modeli
- **RESTful API**: HTTP istekleri

### Web APIs
- **Web Speech API**: Ses tanıma
- **localStorage API**: Veri kaydetme
- **Fetch API**: HTTP istekleri

### Responsive & Accessibility
- **CSS Grid & Flexbox**: Responsive layout
- **ARIA Labels**: Erişilebilirlik
- **Semantic HTML**: SEO uyumlu

## 📱 Responsive Tasarım

### 🖥️ Desktop (768px+)
- Geniş layout ile maksimum alan kullanımı
- Yan yana kontrol butonları
- Büyük input ve mesaj alanları

### 📱 Tablet (481px - 767px)
- Orta boyut optimizasyonu
- Esnek grid sistemi
- Dokunmatik uyumlu butonlar

### 📱 Mobile (≤480px)
- Tek sütun vertical layout
- Full-width butonlar
- Touch-friendly arayüz

## ⚡ Performans

### Optimizasyonlar
- **Font Preloading**: Google Fonts hızlı yükleme
- **CSS Optimizasyonu**: Minimal ve optimize kod
- **Modüler JavaScript**: Class-based mimari
- **GPU Animasyonlar**: Hardware acceleration
- **Event Delegation**: Performant event handling

### Tarayıcı Uyumluluğu
- **Chrome/Edge**: Full destek
- **Firefox**: Full destek
- **Safari**: WebKit prefix ile uyumlu
- **Mobile Browsers**: Touch events desteği

## 🔒 Güvenlik

### API Güvenliği
- **Config Dosyası**: API anahtarı Git'e commit edilmez
- **Environment Variables**: Güvenli yapılandırma
- **Input Sanitization**: XSS koruması
- **HTTPS Zorunluluğu**: Güvenli bağlantı

### Öneriler
- **Production**: Sunucu-side API proxy kullanın
- **Rate Limiting**: API kullanım limitleri
- **Error Handling**: Güvenli hata yönetimi

## 🐛 Sorun Giderme

### API Hataları

**❌ Error 401 - Unauthorized**
```
Çözüm: config.js dosyasında API anahtarınızı kontrol edin
```

**❌ Error 404 - Not Found**
```
Çözüm: İnternet bağlantınızı ve API URL'i kontrol edin
```

**❌ Error 429 - Too Many Requests**
```
Çözüm: Biraz bekleyin, API rate limit'i aşılmış
```

### Yaygın Sorunlar

**🔇 Sesli Yazma Çalışmıyor**
- Mikrofon iznini kontrol edin
- HTTPS bağlantı kullanın
- Tarayıcı uyumluluğunu kontrol edin

**🎭 Test Butonları Çalışmıyor**
- Sayfayı yenileyin
- JavaScript console'da hata kontrol edin
- Event binding'i bekleyin

**🖼️ Logo Gösterilmiyor**
- `assets/images/logo.png` dosyasını kontrol edin
- Fallback emoji otomatik gösterilir

**🌗 Tema Değişmiyor**
- localStorage desteğini kontrol edin
- Tarayıcı cache'ini temizleyin

### Debug İpuçları

```javascript
// Console'da chatbot objesine erişim
window.chatbot

// API anahtarı kontrolü
window.chatbot.API_KEY

// Config kontrolü
window.chatbot.config.getAll()
```

## 📸 Ekran Görüntüleri

<img width="1058" height="869" alt="Ana Sayfa - Açık Tema" src="https://github.com/user-attachments/assets/8be40109-dbbb-4fe2-a7aa-d4d39aa92b9a" />

<img width="1065" height="873" alt="Duygu Analizi - Koyu Tema" src="https://github.com/user-attachments/assets/a7197d1c-ddb9-4b64-ba78-0638d7f0bcb4" />

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. **Fork** yapın
2. **Feature branch** oluşturun: `git checkout -b feature/AmazingFeature`
3. **Commit** yapın: `git commit -m 'Add some AmazingFeature'`
4. **Push** yapın: `git push origin feature/AmazingFeature`
5. **Pull Request** oluşturun

### Katkı Kuralları
- Code style'a uyun
- Commit mesajları açıklayıcı olsun
- Issue'ları referans alın
- Test ekleyin (varsa)

## 📞 İletişim & Destek

- **Issues**: GitHub Issues kullanın
- **Discussions**: Genel sorular için GitHub Discussions
- **Email**: Kritik güvenlik sorunları için

## 🗺️ Roadmap

### Gelecek Sürümler
- [ ] 🌍 Çoklu dil desteği
- [ ] 📊 Grafik görselleştirme
- [ ] 💬 Chat export özelliği
- [ ] 🔌 Plugin sistemi
- [ ] 📱 PWA desteği
- [ ] 🎨 Özelleştirilebilir temalar

### Bilinen Limitasyonlar
- Client-side API kullanımı (güvenlik)
- Tarayıcı Speech API desteği gerekli
- Rate limiting (API limitleri)

---

**Made with ❤️ by [Moussa Bane](https://github.com/MoussaBane)**

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
