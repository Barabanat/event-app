const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const username = 'superadmin';
const password = 'superpassword';
const eventId = null; // Superadmin is not tied to a specific event

bcrypt.hash(password, 10, async (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }

  try {
    await pool.query(
      'INSERT INTO admins (username, password, event_id) VALUES ($1, $2, $3)',
      [username, hashedPassword, eventId]
    );
    console.log('Superadmin created successfully');
    pool.end();
  } catch (error) {
    console.error('Error creating superadmin:', error);
    pool.end();
  }
});
