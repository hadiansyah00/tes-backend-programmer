CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    banner_name VARCHAR(100) NOT NULL,
    banner_image TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO banners (banner_name, banner_image, description) VALUES
('Banner 1', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-1.png', 'Lorem Ipsum Dolor sit amet'),
('Banner 2', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-2.png', 'Lorem Ipsum Dolor sit amet'),
('Banner 3', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-3.png', 'Lorem Ipsum Dolor sit amet'),
('Banner 4', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-4.png', 'Lorem Ipsum Dolor sit amet'),
('Banner 5', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-5.png', 'Lorem Ipsum Dolor sit amet');

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  service_code VARCHAR(50) UNIQUE NOT NULL,
  service_name VARCHAR(100) NOT NULL,
  service_icon TEXT NOT NULL,
  service_tariff INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
INSERT INTO services 
(service_code, service_name, service_icon, service_tariff)
VALUES
('PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000),
('PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000),
('PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000),
('VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000),
('QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000),
('ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);

CREATE TABLE balances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_user_balance UNIQUE (user_id),
  CONSTRAINT balance_non_negative CHECK (balance >= 0)
);

CREATE INDEX idx_balances_user_id ON balances(user_id);
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL
    REFERENCES users(id)
    ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  transaction_type VARCHAR(20) NOT NULL
    CHECK (transaction_type IN ('TOPUP', 'PAYMENT')),
  service_code VARCHAR(50) NULL,
  description TEXT NOT NULL,
  total_amount INTEGER NOT NULL CHECK (total_amount > 0),
  created_on TIMESTAMP NOT NULL DEFAULT NOW()
);
-- foreign key ke services (opsional tapi bagus)
ALTER TABLE transactions
ADD CONSTRAINT fk_service
FOREIGN KEY (service_code)
REFERENCES services(service_code);

