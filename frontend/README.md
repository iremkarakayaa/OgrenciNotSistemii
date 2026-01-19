# Öğrenci Not Sistemi - Frontend

Modern ve kullanıcı dostu bir öğrenci not yönetim sistemi. ASP.NET Core Web API ile entegre çalışan React tabanlı frontend uygulaması.

## 🚀 Teknolojiler

- **React 19.2** - Modern UI Framework
- **Vite 7.2** - Hızlı Build Tool
- **React Router DOM 7.12** - Sayfa yönlendirme
- **Axios 1.13** - HTTP İstekleri
- **Bootstrap 5.3** - Responsive UI Framework
- **Bootstrap Icons 1.13** - İkon Seti
- **SweetAlert2 11.26** - Modern Uyarı Sistemleri

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

```bash
npm install
```

## 🎯 Çalıştırma

### Geliştirme Modu
```bash
npm run dev
```
Uygulama `http://localhost:5173` adresinde çalışacaktır.

### Production Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📱 Özellikler

### 1. Öğrenci İşlemleri
- Öğrenci listeleme
- Yeni öğrenci ekleme (Ad, Soyad, Öğrenci No)
- Öğrenci bilgilerini güncelleme
- Öğrenci silme (Soft Delete)
- Öğrenciye ders atama
- Öğrencinin aldığı dersleri görüntüleme
- Öğrenciden ders kaldırma

### 2. Ders İşlemleri
- Ders listeleme
- Yeni ders ekleme (Ders Adı, Ders Kodu)
- Ders bilgilerini güncelleme
- Ders silme (Soft Delete)

### 3. Notlandırma İşlemleri
- Derslere göre öğrenci listeleme
- Toplu not girişi
- Not güncelleme
- 0-100 arası not validasyonu

## 🔗 API Entegrasyonu

### Backend URL
```
https://localhost:7276/api
```

### Kullanılan Endpointler

#### Öğrenci İşlemleri
- `GET /Students` - Tüm öğrenciler
- `GET /Students/{id}` - Öğrenci detay
- `POST /Students` - Yeni öğrenci
- `PUT /Students` - Öğrenci güncelleme
- `DELETE /Students/{id}` - Öğrenci silme

#### Ders İşlemleri
- `GET /Lessons` - Tüm dersler
- `GET /Lessons/{id}` - Ders detay
- `POST /Lessons` - Yeni ders
- `PUT /Lessons` - Ders güncelleme
- `DELETE /Lessons/{id}` - Ders silme

#### Not İşlemleri
- `GET /Grades` - Tüm notlar
- `GET /Grades/{id}` - Not detay
- `GET /Grades/GetByStudentId/{id}` - Öğrencinin notları
- `POST /Grades` - Yeni not/ders atama
- `PUT /Grades` - Not güncelleme
- `DELETE /Grades/{id}` - Not silme

## 📂 Proje Yapısı

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── Layout.css
│   ├── pages/
│   │   ├── Students.jsx
│   │   ├── Lessons.jsx
│   │   └── Grading.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── alerts.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── vite.config.js
```

## 🎨 Kullanıcı Arayüzü

### Öğrenci Sayfası
- Responsive tablo tasarımı
- Hızlı öğrenci ekleme formu
- Modal ile düzenleme
- Kayıtlı dersler görüntüleme
- Çoklu ders atama

### Ders Sayfası
- Temiz ders listesi
- Satır içi ekleme formu
- Modal ile düzenleme

### Notlandırma Sayfası
- Ders kartları
- Toplu not girişi
- Otomatik kaydetme

## 🔔 Uyarı Sistemi

SweetAlert2 ile modern uyarılar:
- ✅ Başarılı işlemler
- ❌ Hata mesajları
- ⚠️ Uyarılar
- ❓ Onay diyalogları

## ⚙️ API Servisi

`src/services/api.js` dosyası tüm backend iletişimini yönetir:
- Merkezi Axios instance
- Otomatik hata yakalama
- Tutarlı API çağrıları

## 🛡️ Validasyonlar

### Frontend
- Form alanları boş bırakılamaz
- Sayısal değer kontrolleri

### Backend
- FluentValidation ile kapsamlı validasyon
- İş kuralı kontrolleri
- Veritabanı tekrar kontrolleri

## 🚨 Önemli Notlar

1. Backend uygulamasının `https://localhost:7276` adresinde çalışıyor olması gerekir
2. CORS ayarları backend'de yapılandırılmıştır
3. Silme işlemleri soft delete olarak çalışır (DeletedAt)
4. Öğrenci veya ders silindiğinde ilişkili notlar da silinir

## 📝 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
