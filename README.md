# Kişisel Bütçe ve Harcama Takip Sistemi

Bu proje, Sistem Analizi ve Tasarımı dersi kapsamında geliştirilmiş web tabanlı bir kişisel bütçe ve harcama takip sistemidir. Uygulama, kullanıcıların gelir ve giderlerini yönetmesini, bütçe durumlarını takip etmesini ve aylık finansal özetlerini görüntülemesini sağlar.

Proje içerisinde kullanıcı kayıt ve giriş sistemi, JWT tabanlı kimlik doğrulama, kullanıcıya özel veri yönetimi, RESTful API yapısı, CRUD işlemleri, grafik destekli dashboard sistemi, Swagger API dokümantasyonu ve unit test desteği bulunmaktadır.

---

## Proje Amacı

Bu sistemin temel amacı, kullanıcıların kişisel finansal hareketlerini düzenli şekilde takip edebilmesini sağlamaktır.

Kullanıcılar sistem üzerinden:

- Gelir kayıtlarını oluşturabilir ve görüntüleyebilir
- Harcama kayıtlarını ekleyebilir, güncelleyebilir ve silebilir
- Harcamaları kategori ve tarihe göre filtreleyebilir
- Aylık bütçe limiti belirleyebilir
- Toplam gelir, toplam harcama ve kalan bakiye bilgilerini görüntüleyebilir
- Grafik destekli dashboard üzerinden finansal durum analizi yapabilir
- Son finansal hareketlerini takip edebilir
- Aylık raporları görüntüleyebilir

---

## Kullanılan Teknolojiler

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API
- Chart.js
- LocalStorage

### Backend
- Node.js
- Express.js
- RESTful API

### Veritabanı
- SQLite

### Kimlik Doğrulama ve Güvenlik
- JWT Authentication
- bcryptjs ile şifreleme
- Kullanıcıya özel veri erişimi

### Dokümantasyon ve Test
- Swagger UI
- Jest Unit Test
- Nodemon

---

## Temel Özellikler

### Kullanıcı Sistemi
- Yeni kullanıcı kaydı oluşturma
- Kullanıcı girişi yapma
- JWT token üretimi
- Şifrelerin güvenli şekilde hashlenmesi
- Kullanıcıya özel veri yönetimi

### Dashboard
- Toplam gelir görüntüleme
- Toplam harcama görüntüleme
- Kalan bakiye hesaplama
- Finansal özet kartları
- Grafik destekli gelir ve harcama analizi
- Finansal durum paneli

### Harcama Yönetimi
- Harcama ekleme
- Harcama güncelleme
- Harcama silme
- Harcama listeleme
- Başlığa göre arama
- Tarihe göre filtreleme
- Kategori filtreleme

### Gelir Yönetimi
- Gelir ekleme
- Gelir silme
- Gelir listeleme

### Bütçe Yönetimi
- Aylık bütçe limiti belirleme
- Kalan bütçe hesaplama
- Bütçe aşımı kontrolü
- Bütçe bilgisini temizleme

### Son İşlemler
- Son gelir hareketlerini görüntüleme
- Son harcama hareketlerini görüntüleme
- Gelir ve gider işlemlerini farklı renklerle gösterme

### Aylık Raporlar
- Aylık toplam gelir
- Aylık toplam harcama
- Kalan bakiye analizi
- En fazla harcama yapılan kategori

### Ayarlar
- Kullanıcı adı değiştirme
- Dark mode desteği
- Tüm verileri temizleme

---

## Proje Mimarisi

Proje frontend ve backend olmak üzere iki ana bölümden oluşmaktadır.

backend/
- services/
- tests/
- database.js
- server.js
- package.json
- butce.db

frontend/
- index.html
- login.html
- register.html
- app.js
- style.css
- screenshot/

README.md

---

## Kurulum ve Çalıştırma

### 1. Projeyi Klonlama

git clone https://github.com/rewakasem13-lab/KisiselButceVeHarcamaTakipSistemi.git

### 2. Proje Klasörüne Girme

cd KisiselButceVeHarcamaTakipSistemi

### 3. Backend Kurulumu

cd backend

npm install

### 4. Backend Sunucusunu Başlatma

npm run dev

Eğer çalışmazsa:

npm start

Backend şu adreste çalışır:

http://localhost:3000

### 5. Frontend Çalıştırma

Frontend klasöründeki index.html, login.html veya register.html dosyaları VS Code Live Server eklentisi ile çalıştırılabilir.

---

## API Dokümantasyonu

Swagger API dokümantasyonuna backend çalışırken aşağıdaki adresten erişilebilir:

http://localhost:3000/api-docs


---

### Unit Test Sonuçları

![Unit Test Sonuçları](screenshot/testler.jpg)

---

## Geliştirici

Rewa Kasem

---

## Ders

Sistem Analizi ve Tasarımı