# Backend API HIS (Node.js – Express.js)

Backend API HIS adalah RESTful API yang dibangun menggunakan **Node.js** dan **Express.js**, dilengkapi dengan **Swagger/OpenAPI** sebagai dokumentasi kontrak API. Aplikasi ini menyediakan fitur autentikasi user, manajemen banner, layanan pembayaran, saldo, serta transaksi.

---

## 🚀 Tech Stack

* **Node.js**
* **Express.js**
* **PostgreSQL**
* **JWT Authentication**
* **Swagger (OpenAPI 3.0)**

---

## 📌 Fitur Utama

* Registrasi & Login User
* Autentikasi menggunakan JWT
* Manajemen Profil User
* List Banner Aktif
* List Service / Produk
* Top Up Saldo
* Pembayaran Service
* Riwayat Transaksi

---

## 🗄️ Struktur Database (Ringkasan)

### Users

Menyimpan data akun pengguna.

* email (unique)
* password (hashed)
* first_name, last_name
* profile_image

### Banners

Digunakan untuk menampilkan banner promosi.

* banner_name
* banner_image
* description
* is_active

### Services

Daftar layanan yang tersedia untuk pembayaran.

* service_code (unique)
* service_name
* service_icon
* service_tariff

### Balances

Menyimpan saldo user.

* user_id (unique)
* balance (>= 0)

### Transactions

Mencatat transaksi top up dan pembayaran.

* invoice_number (unique)
* transaction_type (TOPUP / PAYMENT)
* service_code (optional)
* total_amount
* created_on

---

## 🔐 Authentication

Sebagian besar endpoint dilindungi oleh **JWT Bearer Token**.

Header yang digunakan:

```
Authorization: Bearer <token>
```

---

## 📖 Dokumentasi API (Swagger)

Dokumentasi API tersedia melalui Swagger UI:

```
GET /api-docs
```

Swagger digunakan sebagai **API Contract** antara backend dan frontend.

---

## 🧪 Contoh Endpoint Utama

### Auth

* `POST /registration` – Registrasi user
* `POST /login` – Login user

### User

* `GET /profile` – Ambil profil user
* `PUT /profile` – Update profil user

### Banner

* `GET /banner` – List banner aktif

### Service

* `GET /services` – List layanan

### Balance & Transaction

* `POST /topup` – Top up saldo
* `POST /transaction` – Pembayaran service
* `GET /transaction/history` – Riwayat transaksi

---

## ▶️ Menjalankan Aplikasi

```bash
npm install
npm run dev
```

Pastikan konfigurasi environment sudah sesuai.

---

## 📂 Environment Variable

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_jwt_secret
```

---

## 👨‍💻 Developer

Hadi Hadiansyah
Backend Programmer (Node.js – Express.js)

---

Aplikasi ini dibuat sebagai bagian dari **Test Praktek Backend Programmer HIS**.
