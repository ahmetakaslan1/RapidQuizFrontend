# Rapid Quiz - Frontend (Kullanıcı Arayüzü) 🎨

Rapid Quiz, kullanıcıların seçtikleri kategorilerde hızla yarışıp puan topladıkları, modern ve şık bir bilgi yarışması oyunudur. Bu repo projenin sadece kullanıcıların gördüğü Ön Yüzünü (Frontend) içerir ve **Vue.js 3** & **Vite** kullanılarak geliştirilmiştir.

## 🌟 Temel Özellikler
- **⚡ Işık Hızında Deneyim:** Vite ve Vue 3 sayesinde sayfalar arası bekleme olmadan, tek sayfa uygulaması (SPA) deneyimi.
- **⏱️ Zamana Karşı Yarış:** Her soruda sürenin azalmasını gösteren dinamik ilerleme çubuğu. Erken cevaplamalara yüksek bonus puan!
- **🏅 Dinamik Skor Tablosu:** Her kategori için veya genel olarak en iyi yarışmacıların listelendiği, API ile anlık konuşan Leaderboard sistemi.
- **🎁 Günün Kategorisi (Daily Challenge):** Her gün özel olarak seçilen (veya yapay zekanın ürettiği) Günün Kategorisi sistemi. Özel parlak animasyonlu gösterim.
- **🛡️ Anti-Cheat (Hile Koruması):** Kullanıcının sayfadan ayrılmasını, pencereyi değiştirmesini veya oyunu durdurmasını engelleyen akıllı önlem sistemleri.

## 🛠️ Kullanılan Teknolojiler
- **Vue.js 3** (Composition API)
- **Vite** (Build Tool)
- **Axios** (API İstekleri)
- **Modern Vanilla CSS** (Glassmorphism ve yumuşak animasyonlar)

---

## 🚀 Kurulum ve Çalıştırma (Geliştirici Ortamı)

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin. (Bilgisayarınızda Node.js kurulu olmalıdır).

### 1. Bağımlılıkları Yükleme
Proje klasörüne girip gerekli kütüphaneleri indirin:
```bash
npm install
```

### 2. Geliştirici Sunucusunu Başlatma
Hızlı geliştirme sunucusunu ayağa kaldırmak için:
```bash
npm run dev
```
Bu komut sonrasında proje tarayıcınızda otomatik olarak çalışacaktır (Genellikle 👉 `http://localhost:5173`).

### 3. Backend (API) Bağlantısı
Frontend projesinin sorunsuz çalışması için [RapidQuizBackend](https://github.com/ahmetakaslan1/RapidQuizBackend) projesinin arka planda çalışıyor olması gerekmektedir (Varsayılan olarak `http://localhost:8000` adresinden API'a bağlanır). API adresini değiştirmek isterseniz `src/services/api.js` veya varsa `.env` dosyası üzerinden ayar yapabilirsiniz.

---

## 👨‍💻 Geliştirici & Telif Hakkı

Bu proje **Ahmet Akaslan** tarafından geliştirilmiştir.
© 2026 Ahmet Akaslan - Tüm hakları saklıdır (All rights reserved). Projenin izinsiz kopyalanması veya ticari amaçlarla kullanılması yasaktır.

---
*Bu proje modern, estetik ve sürükleyici bir kullanıcı deneyimi (UX) sunmak üzere tasarlanmıştır.*
