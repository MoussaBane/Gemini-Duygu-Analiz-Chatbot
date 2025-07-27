# 🤖 Gemini Duygu Analiz Chatbot

Modern ve responsive tasarıma sahip gelişmiş duygu analizi chatbot'u. Gemini AI kullanarak metinlerdeki duyguları analiz eder.

## ✨ Özellikler

- 🎯 **Duygu Analizi**: Emoji, duygu adı ve güven yüzdesi ile detaylı analiz
- 🧠 **Derin Analiz Modu**: Empati seviyesi, psikolojik ipuçları ve edebi referanslar
- 💾 **Geçmiş Kaydetme**: localStorage ile otomatik sohbet geçmişi kaydetme
- 🎤 **Sesle Yazma**: Speech-to-Text teknolojisi ile sesli mesaj girişi
- 🌗 **Tema Desteği**: Header'da entegre edilmiş minimal tema değiştirici
- 📱 **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- 🧪 **Test Cümleleri**: Farklı duygu durumları için hazır test cümleleri
- 🖼️ **Animasyonlu Logo**: Tıklanabilir zoom efekti ve sürekli animasyon

## 🚀 Kurulum

### 1. Proje Dosyalarını İndirin
```bash
git clone https://github.com/MoussaBane/Gemini-Duygu-Analiz-Chatbot.git
cd Gemini-Duygu-Analiz-Chatbot
```

### 2. API Anahtarı Alın
1. [Google AI Studio](https://aistudio.google.com/) hesabınıza giriş yapın
2. "Get API Key" bölümünden yeni bir API anahtarı oluşturun
3. API anahtarınızı kopyalayın

### 3. Logo Dosyasını Ekleyin
Logo dosyanızı `assets/images/` klasörüne `logo.png` adıyla kaydedin. 

**Logo Gereksinimleri:**
- Format: PNG (transparan arkaplan önerilir)
- Boyut: 512x512px veya üzeri (kare format)
- Dosya boyutu: 1MB altında olması önerilir

### 4. API Anahtarını Ekleyin
`js/chatbot.js` dosyasında şu satırı bulun:
```javascript
this.API_KEY = "BURAYA_API_ANAHTARINIZI_YAPISTIIRIN";
```

Kendi API anahtarınızla değiştirin.

### 4. Projeyi Çalıştırın
- **Live Server ile** (Önerilen): VS Code Live Server extension'ı kullanın
- **Python ile**: `python -m http.server 8000`
- **Node.js ile**: `npx serve .`

## 📁 Proje Yapısı

```
GeminiChatBot/
├── index.html          # Ana HTML dosyası
├── assets/
│   └── images/
│       └── logo.png    # Proje logosu
├── css/
│   └── styles.css      # Modern ve responsive CSS
├── js/
│   └── chatbot.js      # JavaScript modülleri
└── README.md          # Bu dosya
```

## 🎨 Tasarım Özellikleri

### Modern UI/UX
- Glassmorphism efektleri
- Smooth animasyonlar
- Gradient renkler
- Box-shadow derinlik efektleri

### Logo Animasyonları
- **Float Animasyonu**: Logo sürekli yumuşak hareket eder
- **Thinking Animasyonu**: AI düşünürken logo sallanır ve rengi değişir
- **Hover Efekti**: Mouse üzerine geldiğinde büyür ve döner
- **Click-to-Zoom**: Logoya tıklayarak yakınlaştırma efekti
- **Glow Efekti**: Logo etrafında parlama efekti
- **Fallback Desteği**: Logo yüklenemezse emoji fallback
- **Responsive**: Tüm ekran boyutlarında optimize

### Tema Sistemi
- **Konum**: Header sağ üst köşesinde minimal buton
- **Tasarım**: Sadece 🌗 emoji ile kompakt görünüm
- **Boyut**: 40x40px (mobilde 36x36px)
- **Animasyon**: Hover efekti ve smooth geçişler
- **Pozisyon**: Header içinde absolute konumlandırma

### Accessibility
- ARIA labels
- Semantic HTML
- Keyboard navigation
- Screen reader uyumlu

## 🔧 Kullanım

### Temel Analiz
1. Metin kutusuna cümlenizi yazın
2. "Gönder" butonuna tıklayın
3. AI analizini görüntüleyin

### Derin Analiz
1. "🧠 Derin Analiz" butonunu açık konuma getirin
2. Metninizi gönderin
3. Detaylı psikolojik analizi inceleyin

### Sesle Yazma
1. 🎤 mikrofon butonuna tıklayın
2. Konuşmaya başlayın
3. Metin otomatik olarak yazılacak

### Tema Değiştirme
1. Header sağ üst köşesindeki 🌗 butonuna tıklayın
2. Açık/Koyu tema arasında geçiş yapın
3. Tema tercihiniz otomatik kaydedilir

### Test Cümleleri
- Farklı duygu durumları için hazır cümleler
- Tek tıkla metin kutusuna eklenir
- 8 farklı duygu kategorisi
- Dinamik event binding ile responsive çalışma

### Logo Etkileşimi
1. **Hover**: Logo üzerine gelin - büyüme efekti
2. **Click**: Logoya tıklayın - zoom efekti
3. **Animasyon**: Sürekli float ve glow efektleri
4. **Fallback**: Logo yüklenemezse otomatik emoji gösterimi

## 🛠️ Teknolojiler

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI**: Google Gemini 1.5 Flash
- **Responsive**: CSS Grid, Flexbox
- **Animations**: CSS Animations, Transitions
- **Accessibility**: ARIA, Semantic HTML
- **Storage**: localStorage API
- **Speech**: Web Speech API

## 📱 Responsive Tasarım

### Desktop (768px+)
- Geniş layout
- Yan yana butonlar
- Büyük input alanları

### Tablet (481px - 767px)
- Orta boyut layout
- Esnek grid yapısı
- Optimize edilmiş buton boyutları

### Mobile (≤480px)
- Tek sütun layout
- Full-width butonlar
- Touch-friendly interface

## 🎯 Performans Optimizasyonları

- **Font Loading**: Google Fonts preconnect
- **CSS**: Minified ve optimize edilmiş
- **JavaScript**: Modüler yapı, class-based architecture
- **Images**: Logo fallback sistemi ile hızlı yükleme
- **Animations**: GPU accelerated transforms
- **Event Handling**: Direct binding ile performant etkileşimler
- **Safari Compatibility**: Webkit prefix desteği

## 🔒 Güvenlik

- API anahtarı client-side (Üretim için sunucu-side önerilir)
- HTTPS bağlantı zorunluluğu
- Input sanitization
- XSS koruması

## 🐛 Sorun Giderme

### API Hatası 401
- API anahtarınızı kontrol edin
- Google AI Studio'da anahtarın aktif olduğunu doğrulayın

### API Hatası 404
- Internet bağlantınızı kontrol edin
- API endpoint'inin doğru olduğunu kontrol edin

### Sesli Yazma Çalışmıyor
- Tarayıcınızın mikrofon iznini kontrol edin
- HTTPS bağlantı kullandığınızdan emin olun

### Test Butonları Çalışmıyor
- Sayfayı yenileyin ve tekrar deneyin
- JavaScript console'da hata kontrolü yapın

### Logo Gösterilmiyor
- `assets/images/logo.png` dosyasının var olduğunu kontrol edin
- Fallback emoji otomatik gösterilmelidir

### Tema Değiştirme Çalışmıyor
- localStorage desteğini kontrol edin
- Tarayıcı önbelleğini temizleyip tekrar deneyin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız için issue açabilir veya benimle iletişime geçebilirsiniz.

---
Made with ❤️ by Moussa Bane
