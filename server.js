const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Parser } = require('json2csv');
const { WebSocketServer } = require('ws');
const pdf = require('html-pdf-node');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const cors = require('cors');
const nodemailer = require('nodemailer');

dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // generated ethereal user
    pass: process.env.SMTP_PASS, // generated ethereal password
  },
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ error: 'Token is required' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Invalid token:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Middleware to verify admin's events
const verifyAdminEvent = async (req, res, next) => {
  try {
    const adminEventsResult = await pool.query('SELECT event_id FROM admin_events WHERE admin_id = $1', [req.userId]);
    const adminEvents = adminEventsResult.rows.map(row => row.event_id);
    if (adminEvents.length === 0) return res.status(404).json({ error: 'Admin not found' });

    req.adminEventIds = adminEvents;
    next();
  } catch (error) {
    console.error('Error verifying admin events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to validate password strength
const isPasswordStrong = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  );
};

const generateReceiptPDF = async (order, event) => {
  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 0; color: #888; }
          .details { margin-bottom: 20px; }
          .details h2 { margin: 0 0 10px 0; font-size: 18px; }
          .details p { margin: 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Receipt</h1>
            <p>Order Number: ${order.order_number}</p>
          </div>
          <div class="details">
            <h2>Event Details</h2>
            <p>Event: ${event.title}</p>
            <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
            <p>Location: ${event.location}</p>
            <p>Price: $${(order.total / 100).toFixed(2)}</p>
          </div>
          <div class="details">
            <h2>Customer Details</h2>
            <p>Name: ${order.first_name} ${order.last_name}</p>
            <p>Email: ${order.email}</p>
            <p>Phone: ${order.phone_number}</p>
            <p>T-Shirt Size: ${order.t_shirt_size}</p>
          </div>
          <div class="footer">
            <p>Payment Solution Provider: Banatcom.com</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const file = { content: html };
  const pdfBuffer = await pdf.generatePdf(file, { format: 'A4' });
  return pdfBuffer;
};

const sendOrderConfirmationEmail = async (order, eventDetails) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: order.email,
    subject: 'Order Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank you for your order, ${order.first_name} ${order.last_name}!</h2>
        <p>Here are your order details:</p>
        <ul>
          <li>Order Number: <strong>${order.order_number}</strong></li>
          <li>Event: <strong>${eventDetails.title}</strong></li>
          <li>Date: <strong>${new Date(eventDetails.date).toLocaleDateString()}</strong></li>
          <li>Location: <strong>${eventDetails.location}</strong></li>
          <li>Total: <strong>$${(order.total / 100).toFixed(2)}</strong></li>
        </ul>
        <h3>Billing Information:</h3>
        <ul>
          <li>First Name: ${order.first_name}</li>
          <li>Last Name: ${order.last_name}</li>
          <li>Email: ${order.email}</li>
          <li>Phone Number: ${order.phone_number}</li>
          <li>T-Shirt Size: ${order.t_shirt_size}</li>
        </ul>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best regards,<br>The Banatcom Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};



const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.SMTP_USER, // sender address
    to: email, // list of receivers
    subject: 'Welcome to Banatcom Payment Solutions', // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to Banatcom Payment Solutions, ${username}!</h2>
        <p>Thank you for signing up. We're excited to have you on board!</p>
        <p>Here are your registration details:</p>
        <ul>
          <li>Username: <strong>${username}</strong></li>
          <li>Email: <strong>${email}</strong></li>
        </ul>
        <p>If you have any questions, feel free to reach out to us about the platform or if you would like to create your own software at BanatcomSolutions@gmail.com.</p>
        <p>Best regards,<br>The Banatcom Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// User registration route
app.post('/api/user/register', async (req, res) => {
  let { username, password, email, phoneNumber, address } = req.body;

  if (!username || !password || !email || !phoneNumber || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Convert username to lowercase
  username = username.toLowerCase();

  try {
    // Check if username already exists
    const userResult = await pool.query('SELECT * FROM users WHERE LOWER(username) = $1', [username]);
    if (userResult.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Validate password strength
    if (!isPasswordStrong(password)) {
      return res.status(400).json({ error: 'Password is too weak' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, password, email, phone_number, address, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id',
      [username, hashedPassword, email, phoneNumber, address]
    );

    // Send welcome email
    await sendWelcomeEmail(email, username);

    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login route
app.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create an order by admin
app.post('/api/admin/orders', verifyToken, verifyAdminEvent, async (req, res) => {
  const { firstName, lastName, email, phoneNumber, tShirtSize, total, eventId } = req.body;

  if (!firstName || !lastName || !email || !phoneNumber || !tShirtSize || total === undefined || !eventId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (
        order_number, 
        event_id, 
        total, 
        first_name, 
        last_name, 
        email, 
        phone_number, 
        t_shirt_size, 
        user_id, 
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *`,
      [
        Math.random().toString(36).substring(2, 15), // generating random order_number
        eventId,
        total,
        firstName,
        lastName,
        email,
        phoneNumber,
        tShirtSize,
        req.userId
      ]
    );
    const savedOrder = result.rows[0];
    res.status(201).json(savedOrder);

    // Broadcast the new order to all connected WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(savedOrder));
      }
    });

    // Send order confirmation email
    await sendOrderConfirmationEmail(savedOrder);

  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Superadmin route to create an admin
app.post('/api/superadmin/create-admin', verifyToken, async (req, res) => {
  const { username, password, eventIds } = req.body;

  if (!username || !password || !eventIds || !Array.isArray(eventIds)) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );
    const adminId = result.rows[0].id;

    const adminEvents = eventIds.map(eventId => [adminId, eventId]);
    const adminEventsQuery = 'INSERT INTO admin_events (admin_id, event_id) VALUES ($1, $2)';
    await Promise.all(adminEvents.map(event => pool.query(adminEventsQuery, event)));

    res.status(201).json({ adminId });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Superadmin route to delete an admin
app.delete('/api/superadmin/admins/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Delete from admin_events
    await client.query('DELETE FROM admin_events WHERE admin_id = $1', [id]);

    // Delete the admin
    await client.query('DELETE FROM admins WHERE id = $1', [id]);

    await client.query('COMMIT');
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

// Route to create a seller
app.post('/api/sellers', verifyToken, async (req, res) => {
  const { eventId, stripeAccountId } = req.body;

  if (!eventId || !stripeAccountId) {
    return res.status(400).json({ error: 'Event ID and Stripe Account ID are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO sellers (event_id, stripe_account_id) VALUES ($1, $2) RETURNING *',
      [eventId, stripeAccountId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating seller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Superadmin route to delete an event
app.delete('/api/superadmin/events/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Update event_id in orders and sellers to NULL
    await client.query('UPDATE orders SET event_id = NULL WHERE event_id = $1', [id]);
    await client.query('UPDATE sellers SET event_id = NULL WHERE event_id = $1', [id]);

    // Delete from admin_events
    await client.query('DELETE FROM admin_events WHERE event_id = $1', [id]);

    // Delete the event
    await client.query('DELETE FROM events WHERE id = $1', [id]);

    await client.query('COMMIT');
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

// Route to fetch all admins for superadmin
app.get('/api/superadmin/admins', verifyToken, async (req, res) => {
  try {
    const adminsResult = await pool.query('SELECT id, username FROM admins');
    const admins = adminsResult.rows;

    for (const admin of admins) {
      const eventsResult = await pool.query('SELECT event_id FROM admin_events WHERE admin_id = $1', [admin.id]);
      admin.event_ids = eventsResult.rows.map(row => row.event_id);
    }

    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin login route
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Admin login attempt:', { username });

  try {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];
    if (!admin) {
      console.log('Admin not found');
      return res.status(404).json({ error: 'Admin not found' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin.id }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Superadmin login route
app.post('/api/superadmin/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM superadmins WHERE username = $1', [username]);
    const superadmin = result.rows[0];
    if (!superadmin) return res.status(404).json({ error: 'Superadmin not found' });

    const isValid = await bcrypt.compare(password, superadmin.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: superadmin.id }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in superadmin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add this route to create a seller
app.post('/api/superadmin/sellers', verifyToken, async (req, res) => {
  const { eventId, stripeAccountId } = req.body;

  if (!eventId || !stripeAccountId) {
    return res.status(400).json({ error: 'Event ID and Stripe Account ID are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO sellers (event_id, stripe_account_id) VALUES ($1, $2) RETURNING *',
      [eventId, stripeAccountId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating seller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add this route to delete a seller
app.delete('/api/superadmin/sellers/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM sellers WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Seller not found' });
    }
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add this route to fetch all sellers
app.get('/api/superadmin/sellers', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sellers');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sellers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, eventId } = req.body;

  if (!amount || amount < 50 || !eventId) {
    return res.status(400).json({ error: 'Amount must be at least the minimum charge amount and Event ID is required.' });
  }

  try {
    // Fetch the seller's Stripe account ID from the database
    const result = await pool.query('SELECT stripe_account_id FROM sellers WHERE event_id = $1', [eventId]);
    const seller = result.rows[0];

    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'cad',
      application_fee_amount: 50, // Your commission fee in cents
      transfer_data: {
        destination: seller.stripe_account_id,
      },
    });

    res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Save order
app.post('/api/orders', verifyToken, async (req, res) => {
  const { orderNumber, event, total, formData } = req.body;

  if (!orderNumber || !event || !total || !formData) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO orders (order_number, event_id, total, first_name, last_name, email, phone_number, t_shirt_size, user_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *',
      [
        orderNumber,
        event.id,
        total,
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phoneNumber,
        formData.tShirtSize,
        req.userId
      ]
    );
    const savedOrder = result.rows[0];

    // Fetch event details
    const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [event.id]);
    const eventDetails = eventResult.rows[0];

    // Send order confirmation email
    await sendOrderConfirmationEmail(savedOrder, eventDetails);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route for fetching the admin's events
app.get('/api/admin/events', verifyToken, verifyAdminEvent, async (req, res) => {
  try {
    const result = await pool.query('SELECT event_id FROM admin_events WHERE admin_id = $1', [req.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    const eventIds = result.rows.map(row => row.event_id);
    res.json({ event_id: eventIds });
  } catch (error) {
    console.error('Error fetching admin events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all events and assigned admins for superadmin
app.get('/api/superadmin/events', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT events.*, admins.username AS admin_username
      FROM events
      LEFT JOIN admin_events ON events.id = admin_events.event_id
      LEFT JOIN admins ON admin_events.admin_id = admins.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch all orders for superadmin
app.get('/api/superadmin/orders', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT orders.*, events.title AS event_title
      FROM orders
      LEFT JOIN events ON orders.event_id = events.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Superadmin route to delete an order by ID
app.delete('/api/superadmin/orders/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update event description
app.put('/api/events/:id', verifyToken, verifyAdminEvent, async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const result = await pool.query(
      'UPDATE events SET description = $1 WHERE id = $2 RETURNING *',
      [description, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  const eventId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    const event = result.rows[0];
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ error: 'Event not found' });
    }
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete an event (superadmin)
app.delete('/api/superadmin/events/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch all users for superadmin
app.get('/api/superadmin/users', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, phone_number, address FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Superadmin route to delete a user
app.delete('/api/superadmin/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Admin route to delete an order by ID
app.delete('/api/orders/:id', verifyToken, verifyAdminEvent, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch all orders for the event assigned to the admin
app.get('/api/orders', verifyToken, verifyAdminEvent, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT orders.*, events.title AS event_title
      FROM orders
      JOIN events ON orders.event_id = events.id
      WHERE orders.event_id = ANY ($1::int[])
    `, [req.adminEventIds]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch user details
app.get('/api/user/profile', verifyToken, async (req, res) => {
  try {
    const userResult = await pool.query('SELECT username, email, phone_number, address FROM users WHERE id = $1', [req.userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const ordersResult = await pool.query('SELECT * FROM orders WHERE user_id = $1', [req.userId]);

    res.json({
      user: userResult.rows[0],
      orders: ordersResult.rows,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for adding an event (superadmin)
app.post('/api/superadmin/events', verifyToken, async (req, res) => {
  const { title, date, location, price, imageUrl, description, startTime, endTime } = req.body;

  if (!title || !date || !location || !price || !imageUrl || !description || !startTime || !endTime) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO events (title, date, location, price, image_url, description, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, date, location, price, imageUrl, description, startTime, endTime]
    );
    res.status(201).json(result.rows[0]);

    // Broadcast the new event to all connected WebSocket clients
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(result.rows[0]));
      }
    });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/orders/download', verifyToken, verifyAdminEvent, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE event_id = ANY ($1::int[])', [req.adminEventIds]);
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(result.rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('orders.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Error generating CSV:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/orders', verifyToken, verifyAdminEvent, async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE event_id = ANY ($1::int[])', [req.adminEventIds]);
    res.status(200).json({ message: 'All orders for the event have been cleared' });
  } catch (error) {
    console.error('Error clearing orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/orders/:orderNumber/download', verifyToken, verifyAdminEvent, async (req, res) => {
  const orderNumber = req.params.orderNumber;
  try {
    const result = await pool.query(`
      SELECT orders.*, events.title AS event_title, events.date AS event_date, events.location AS event_location, events.start_time AS event_start_time, events.end_time AS event_end_time 
      FROM orders 
      JOIN events ON orders.event_id = events.id 
      WHERE orders.order_number = $1 AND orders.event_id = ANY ($2::int[])`, 
      [orderNumber, req.adminEventIds]
    );
    
    const order = result.rows[0];

    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('Order found:', order);

    const eventDate = new Date(order.event_date).toLocaleDateString();

    // Format the time correctly
    const formatTime = (timeString) => {
      const [hour, minute] = timeString.split(':');
      const hourInt = parseInt(hour, 10);
      const period = hourInt >= 12 ? 'PM' : 'AM';
      const formattedHour = hourInt % 12 || 12;
      return `${formattedHour}:${minute} ${period}`;
    };

    const startTime = formatTime(order.event_start_time);
    const endTime = formatTime(order.event_end_time);

    console.log('Formatted start time:', startTime);
    console.log('Formatted end time:', endTime);

    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .receipt-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 10px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin: 0;
              color: #888;
            }
            .details {
              margin-bottom: 20px;
            }
            .details h2 {
              margin: 0 0 10px 0;
              font-size: 18px;
            }
            .details p {
              margin: 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1>Receipt</h1>
              <p>Order Number: ${order.order_number}</p>
            </div>
            <div class="details">
              <h2>Event Details</h2>
              <p>Event: ${order.event_title}</p>
              <p>Date: ${eventDate}</p>
              <p>Start Time: ${startTime}</p>
              <p>End Time: ${endTime}</p>
              <p>Location: ${order.event_location}</p>
              <p>Price: $${(order.total / 100).toFixed(2)}</p>
            </div>
            <div class="details">
              <h2>Customer Details</h2>
              <p>Name: ${order.first_name} ${order.last_name}</p>
              <p>Email: ${order.email}</p>
              <p>Phone: ${order.phone_number}</p>
              <p>T-Shirt Size: ${order.t_shirt_size}</p>
            </div>
            <div class="footer">
              <p>Payment Solution Provider: Banatcom.com</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const file = { content: html };
    pdf.generatePdf(file, { format: 'A4' }).then(pdfBuffer => {
      res.header('Content-Type', 'application/pdf');
      res.attachment(`receipt_${orderNumber}.pdf`);
      res.send(pdfBuffer);
    }).catch(error => {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
