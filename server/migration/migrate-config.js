const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const migrate = async () => {
  try {
    const client = await pool.connect();
    
    const statements = [
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        phone_number VARCHAR(20),
        email VARCHAR(255),
        address VARCHAR(255)
      );`,

      `CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        event_id INTEGER
      );`,

      `CREATE TABLE IF NOT EXISTS superadmins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );`,

      `CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE,
        location VARCHAR(255),
        price INTEGER,
        image_url VARCHAR(255),
        description TEXT,
        start_time TIME,
        end_time TIME
      );`,

      `CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(255) NOT NULL,
        event_id INTEGER,
        total INTEGER NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255),
        phone_number VARCHAR(20),
        t_shirt_size VARCHAR(20),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER
      );`,

      `CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,
        event_id INTEGER,
        stripe_account_id VARCHAR(255)
      );`,

      `CREATE TABLE IF NOT EXISTS admin_events (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        event_id INTEGER
      );`,

      `INSERT INTO superadmins (username, password) VALUES ('admin', '$2b$10$0YqcMePLLm.qc7tnRpoOs.dLk059QF4CLbRDcJ0S.Mz0oRld5T7cu');`,

      `INSERT INTO admins (username, password) VALUES 
      ('superadmin', '$2b$10$FkMP87zL/sVRUo7DLPnmCu2NtgHfgKQzhj16vPE.keITQPyHbCM/6'),
      ('nehal', '$2b$10$zy74IxNkpu665tqMULZ..erDqHXM9pID/i/Ks9.sAYwWAHX1cOwUq');`,

      `INSERT INTO users (username, password, created_at, phone_number, email, address) VALUES 
      ('test2', '$2b$10$y3PlkuNUjJNv0Bd.Q8ec2eOwzEZ4LIfPjSQoamtcy.7NK05dFfSl.', '2024-08-02 23:36:43.527412', '2265031072', 'sccassociationlondon@gmail.com', '162 Golfdale Crescent'),
      ('test5', '$2b$10$Jzd1ZSkVLydB/HYZwVIpN.6XqKIMAlYtV3HEeR8ljAgfBN8Pulmm2', '2024-08-03 04:37:29.726329', '2265031072', 'banatbara0@gmail.com', '162 golfdale crescent'),
      ('Sara', '$2b$10$.5UCjw.YacSxrhA8S8maDuKqLeuDGb8TdFg4BUf7tKbxjF.eh8WZi', '2024-08-03 08:26:15.840582', '2262243952', 'Saradeya28@gmail.com', '162 golfdale crescent'),
      ('test6', '$2b$10$ya1LwBmEWI9alKskH5PC0eXvE8GGOsattAD7sbofgrLK0yGtHF2rC', '2024-08-03 19:09:41.723801', '2265031072', 'sccassociationlondon@gmail.com', '162 Golfdale Crescent'),
      ('test7', '$2b$10$LaYcnX8Cxczjzx.NMsZbeuCShuIXFLhpo32.IZ4FHQYyfkeXxSB7C', '2024-08-03 19:10:04.810234', '2265031072', 'sccassociationlondon@gmail.com', '162 Golfdale Crescent'),
      ('test8', '$2b$10$482Q30UteJMdmUGUx2UgL./EFqztIvbCuxomOg.qqBqU4thodcVmG', '2024-08-04 12:56:31.969179', '2265031072', 'sccassociationlondon@gmail.com', '162 Golfdale Crescent'),
      ('test9', '$2b$10$XaJNOQ59SxCxWjRmMCX2ZO7gl2qmIBg45NQqhns8GnVdihj/xzpcW', '2024-08-04 12:57:38.01499', '2265031072', 'sccassociationlondon@gmail.com', '162 Golfdale Crescent'),
      ('bbanat', '$2b$10$9e5uV6Qy6h2dp.ZIynB5xupMWh.IPUTWZFmYp2OKtTMwD9ujJr39i', '2024-08-04 13:33:49.705113', '2265031072', 'banatbara0@gmail.com', '162 Golfdale Crescent'),
      ('wowww', '$2b$10$j.wVmoN2K/SEnecWC4iHE.4lkKferjzW/DlxhC94xD3SZAkfz9XG2', '2024-08-04 13:40:02.390959', '2265031072', 'banatbara0@gmail.com', '162 Golfdale Crescent'),
      ('bbanat2', '$2b$10$XPRhI8mmvHmKXR9YvJiCA.WsMSf59Dd0tat5qwKhaFVgRCvJcaUBK', '2024-08-04 13:41:41.341458', '2265031072', 'banatbara0@gmail.com', '162 Golfdale Crescent'),
      ('bbanat5', '$2b$10$s37WmzAwiPjCSQJhEt6I8OqIYjtBh9EM4wcoJTUcyV7Ypskhyx6Gi', '2024-08-04 13:43:17.558637', '2265031072', 'banatbara0@gmail.com', '162 Golfdale Crescent'),
      ('sarab', '$2b$10$RqWEkIIeuvbbiTRBLiayDuTrnuEXUKiAj3kdL1AaUi86.Q4CD4cuy', '2024-08-04 14:36:47.574409', '2262243952', 'saradeya28@gmail.com', '162 golfdale crescent');`,

      `INSERT INTO events (title, date, location, price, image_url, description, start_time, end_time) VALUES 
      ('Run for Palestine Early Bird Adult T-Shirt & Run', '2024-09-14', 'Greenway Park, London, ON', 3328, 'https://example.com/image1.jpg', 'This is a test description for the Run for Palestine Early Bird event.', '09:00:00', '18:30:00'),
      ('Run for Palestine Adult T-Shirt + Run Admission', '2024-09-14', 'Greenway Park, London, ON', 3861, 'https://example.com/image2.jpg', 'This is a test description for the Run for Palestine Adult event.', '09:00:00', '18:30:00'),
      ('Run for Palestine Youth T-Shirt + Run Admission', '2024-09-14', 'Greenway Park, London, ON', 2263, 'https://example.com/image3.jpg', 'This is a test description for the Run for Palestine Youth event.', '09:00:00', '18:30:00');`
    ];

    for (let statement of statements) {
      await client.query(statement);
    }

    console.log('Migration completed successfully');
    client.release();
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await pool.end();
  }
};

migrate();