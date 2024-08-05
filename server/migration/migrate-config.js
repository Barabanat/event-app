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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        phone_number VARCHAR(20),
        email VARCHAR(255),
        address VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        event_id INTEGER
      );

      CREATE TABLE IF NOT EXISTS superadmins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE,
        location VARCHAR(255),
        price INTEGER,
        image_url VARCHAR(255),
        description TEXT,
        start_time TIME,
        end_time TIME
      );

      CREATE TABLE IF NOT EXISTS orders (
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
      );

      CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,
        event_id INTEGER,
        stripe_account_id VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS admin_events (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        event_id INTEGER
      );

      INSERT INTO superadmins (username, password) VALUES ('admin', '$2b$10$0YqcMePLLm.qc7tnRpoOs.dLk059QF4CLbRDcJ0S.Mz0oRld5T7cu');
      INSERT INTO admins (username, password) VALUES ('superadmin', '$2b$10$FkMP87zL/sVRUo7DLPnmCu2NtgHfgKQzhj16vPE.keITQPyHbCM/6'), ('nehal', '$2b$10$zy74IxNkpu665tqMULZ..erDqHXM9pID/i/Ks9.sAYwWAHX1cOwUq');
      INSERT INTO users (username, password, created_at, phone_number, email, address) VALUES 
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
      ('sarab', '$2b$10$RqWEkIIeuvbbiTRBLiayDuTrnuEXUKiAj3kdL1AaUi86.Q4CD4cuy', '2024-08-04 14:36:47.574409', '2262243952', 'saradeya28@gmail.com', '162 golfdale crescent');
      
      INSERT INTO events (title, date, location, price, image_url, description, start_time, end_time) VALUES 
      ('Run for Palestine Early Bird Adult T-Shirt & Run (Ends AUG 11th) - London Ontario 2024', '2024-09-14', 'Greenway Park Terry Fox Parkway London, ON N6J 1E8', 3328, 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F815595069%2F92032409627%2F1%2Foriginal.20240727-161611?w=720&auto=format%2Ccompress&q=75&sharp=10&rect=1%2C0%2C1278%2C639&s=98b662ea2458cb3a1dbad2c1f922184d', ' Run for Palestine (RFP) is a family-oriented, fun-filled day across Canada that welcomes all members of the community. Participants can walk 1 km or run 5 km to raise funds for much-needed humanitarian projects helping the Palestinian people. The event will take place on Saturday SEP 14th, 2024 along the beautiful trail of Greenway Park, located in London. After the run, there will be food available, a bazaar, and entertainment. The trail accommodates wheelchairs and strollers. We encourage participation of all community members of different activity lifestyles and mobility backgrounds. **REGISTRATION LOCATIONS** Park Name: Greenway Park Address: 1E8 Terry Fox Parkway **PURCHASE POLICY** Tickets CANNOT be refunded If you would like to be a sponsor our event, be a vendor at the Bazaar, or volunteer for RFP London 2024 please contact Run for Palestine London on Instagram. (@runforpalestine.london) or fill the forms on CPSALondon.ca **OUR FOUR INSPIRING PROJECTS:** **GLIA - Gaza Medical Support Initiative:** GLIA believes that quality healthcare should be accessible to all. There is an emphasis on doctors bringing their skills and lifesaving supplies to the people of Gaza. During the October 2023 war, Glia Gaza immediately distributed its full inventory of over 1000 tourniquets to first responders and hospitals that were treating casualties of shellings and bombings. At the time of this publication, this war is ongoing and the number of injured and dead continues to rise. On October 10, Glia’s offices were heavily damaged as a result of a nearby bombing, making it nearly impossible to manufacture any more tourniquets in this facility for the foreseeable future. Glia has an ongoing campaign to ensure Gaza is adequately stocked with tourniquets, as part of its broader Stop the Bleed: Gaza initiative, which also provides training on the proper use and application of tourniquets. **Islamic Relief Canada** We have once again partnered with Islamic Relief Canada to procure food, hygiene supplies, bedding, and any other essential item that can be sourced. They screen and contract local suppliers and partners, who procure either locally or through private trading routes between Gaza and Egypt. Islamic Relief has successfully facilitated aid trucks entering Gaza through the Egypt border crossing, which has helped to alleviate some of the pressure on the ground. We are also actively exploring additional avenues of aid through various border crossings. Working alongside local partners and the World Food Programme, we are presently active in the Middle Area including Deir Al Balah, Zawayda, and Al Nusairat, as well Khan Younis and Rafah. **Empowering Education Through CPPF (OMAR BARZAK SCHOLARSHIP):** Our collaboration with the Canadian Palestinian Professional Foundation (CPPF) focuses on nurturing academic excellence and leadership in Palestine. Through scholarship funding and support, we are shaping the future generation by enabling them to pursue education and professional growth. Join us in fostering brighter prospects for these talented students. **Enhancing Neonatal Care in London:** Babies in the NICU require constant monitoring and precise control of their environment, down to the degree, as well as frequent testing to prioritize their constant medical needs and complications. In order to ensure that NICU babies – who often weigh less than a stick of butter – can be safely transported to different procedure and assessment rooms along with all their equipment, Children’s needs a replacement NICU shuttle. Children’s Hospital would like to purchase a new NICU shuttle, to replace a decommissioned model.... This state-of-the-art shuttle makes it possible for an infant’s developmentally supportive “microenvironment” – comprised of incubators, ventilators, IV’s and more - to move with them. Vulnerable infants can be transported quickly and easily to assessments and procedures without fear of worsening their condition or experiencing loss of power to vital equipment. **YOUR IMPACT MATTERS** Your contributions have already shown incredible results. Last year, your generosity helped us raise over $160,000 for essential medical equipment and furnishings for the maternity department at Al-Shifa hospital in Gaza. This achievement was made possible by the dedication of over 4000 attendees across Canada who united to support Palestine's most vulnerable populations. **TOGETHER WE CAN ACHIEVE MORE** With your continued support, we aim to strengthen healthcare systems, provide vital equipment, essential drugs, and offer capacity-building support to medical professionals. Your donations enable us to conduct in-person and online medical training, ensuring that care providers have the knowledge they need to save lives. ', '09:00:00', '18:30:00'), 
      ('Run for Palestine Adult T-Shirt + Run Admission - London Ontario 2024', '2024-09-14', 'Greenway Park Terry Fox Parkway London, ON N6J 1E8', 3861, 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F815595069%2F92032409627%2F1%2Foriginal.20240727-161611?w=720&auto=format%2Ccompress&q=75&sharp=10&rect=1%2C0%2C1278%2C639&s=98b662ea2458cb3a1dbad2c1f922184d', ' Run for Palestine (RFP) is a family-oriented, fun-filled day across Canada that welcomes all members of the community. Participants can walk 1 km or run 5 km to raise funds for much-needed humanitarian projects helping the Palestinian people. The event will take place on Saturday SEP 14th, 2024 along the beautiful trail of Greenway Park, located in London. After the run, there will be food available, a bazaar, and entertainment. The trail accommodates wheelchairs and strollers. We encourage participation of all community members of different activity lifestyles and mobility backgrounds. **REGISTRATION LOCATIONS** Park Name: Greenway Park Address: 1E8 Terry Fox Parkway **PURCHASE POLICY** Tickets CANNOT be refunded If you would like to be a sponsor our event, be a vendor at the Bazaar, or volunteer for RFP London 2024 please contact Run for Palestine London on Instagram. (@runforpalestine.london) or fill the forms on CPSALondon.ca **OUR FOUR INSPIRING PROJECTS:** **GLIA - Gaza Medical Support Initiative:** GLIA believes that quality healthcare should be accessible to all. There is an emphasis on doctors bringing their skills and lifesaving supplies to the people of Gaza. During the October 2023 war, Glia Gaza immediately distributed its full inventory of over 1000 tourniquets to first responders and hospitals that were treating casualties of shellings and bombings. At the time of this publication, this war is ongoing and the number of injured and dead continues to rise. On October 10, Glia’s offices were heavily damaged as a result of a nearby bombing, making it nearly impossible to manufacture any more tourniquets in this facility for the foreseeable future. Glia has an ongoing campaign to ensure Gaza is adequately stocked with tourniquets, as part of its broader Stop the Bleed: Gaza initiative, which also provides training on the proper use and application of tourniquets. **Islamic Relief Canada** We have once again partnered with Islamic Relief Canada to procure food, hygiene supplies, bedding, and any other essential item that can be sourced. They screen and contract local suppliers and partners, who procure either locally or through private trading routes between Gaza and Egypt. Islamic Relief has successfully facilitated aid trucks entering Gaza through the Egypt border crossing, which has helped to alleviate some of the pressure on the ground. We are also actively exploring additional avenues of aid through various border crossings. Working alongside local partners and the World Food Programme, we are presently active in the Middle Area including Deir Al Balah, Zawayda, and Al Nusairat, as well Khan Younis and Rafah. **Empowering Education Through CPPF (OMAR BARZAK SCHOLARSHIP):** Our collaboration with the Canadian Palestinian Professional Foundation (CPPF) focuses on nurturing academic excellence and leadership in Palestine. Through scholarship funding and support, we are shaping the future generation by enabling them to pursue education and professional growth. Join us in fostering brighter prospects for these talented students. **Enhancing Neonatal Care in London:** Babies in the NICU require constant monitoring and precise control of their environment, down to the degree, as well as frequent testing to prioritize their constant medical needs and complications. In order to ensure that NICU babies – who often weigh less than a stick of butter – can be safely transported to different procedure and assessment rooms along with all their equipment, Children’s needs a replacement NICU shuttle. Children’s Hospital would like to purchase a new NICU shuttle, to replace a decommissioned model. This state-of-the-art shuttle makes it possible for an infant’s developmentally supportive “microenvironment” – comprised of incubators, ventilators, IV’s and more - to move with them. Vulnerable infants can be transported quickly and easily to assessments and procedures without fear of worsening their condition or experiencing loss of power to vital equipment. **YOUR IMPACT MATTERS** Your contributions have already shown incredible results. Last year, your generosity helped us raise over $160,000 for essential medical equipment and furnishings for the maternity department at Al-Shifa hospital in Gaza. This achievement was made possible by the dedication of over 4000 attendees across Canada who united to support Palestine's most vulnerable populations. **TOGETHER WE CAN ACHIEVE MORE** With your continued support, we aim to strengthen healthcare systems, provide vital equipment, essential drugs, and offer capacity-building support to medical professionals. Your donations enable us to conduct in-person and online medical training, ensuring that care providers have the knowledge they need to save lives. ', '09:00:00', '18:30:00'), 
      ('Run for Palestine Youth T-Shirt + Run Admission - London Ontario 2024', '2024-09-14', 'Greenway Park Terry Fox Parkway London, ON N6J 1E8', 2263, 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F815595069%2F92032409627%2F1%2Foriginal.20240727-161611?w=720&auto=format%2Ccompress&q=75&sharp=10&rect=1%2C0%2C1278%2C639&s=98b662ea2458cb3a1dbad2c1f922184d', '<p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Run for Palestine (RFP) is a family-oriented, fun-filled day across Canada that welcomes all members of the community. Participants can walk 1 km or run 5 km to raise funds for much-needed humanitarian projects helping the Palestinian people.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">The event will take place on Saturday SEP 14th, 2024 along the beautiful trail of Greenway Park, located in London. After the run, there will be food available, a bazaar, and entertainment. The trail accommodates wheelchairs and strollers. We encourage participation of all community members of different activity lifestyles and mobility backgrounds.</span></p><p><strong style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">REGISTRATION LOCATIONS</strong></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Park Name: Greenway Park</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Address: 1E8 Terry Fox Parkway</span></p><p><strong style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">PURCHASE POLICY</strong></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Tickets CANNOT be refunded</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">If you would like to be a sponsor our event, be a vendor at the Bazaar, or volunteer for RFP London 2024 please contact Run for Palestine London on Instagram. (@runforpalestine.london) or fill the forms on CPSALondon.ca</span></p><p><strong style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">OUR FOUR INSPIRING PROJECTS:</strong></p><p><br></p><p><strong style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">GLIA - Gaza Medical Support Initiative:</strong></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">GLIA believes that quality healthcare should be accessible to all. There is an emphasis on doctors bringing their skills and lifesaving supplies to the people of Gaza.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">During the October 2023 war, Glia Gaza immediately distributed its full inventory of over 1000 tourniquets to first responders and hospitals that were treating casualties of shellings and bombings. At the time of this publication, this war is ongoing and the number of injured and dead continues to rise. On October 10, Glia’s offices were heavily damaged as a result of a nearby bombing, making it nearly impossible to manufacture any more tourniquets in this facility for the foreseeable future. Glia has an ongoing campaign to ensure Gaza is adequately stocked with tourniquets, as part of its broader Stop the Bleed: Gaza initiative, which also provides training on the proper use and application of tourniquets.</span></p><p><strong style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Islamic Relief Canada</strong></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">We have once again partnered with Islamic Relief Canada to procure food, hygiene supplies, bedding, and any other essential item that can be sourced. They screen and contract local suppliers and partners, who procure either locally or through private trading routes between Gaza and Egypt.</span></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Islamic Relief has successfully facilitated aid trucks entering Gaza through the Egypt border crossing, which has helped to alleviate some of the pressure on the ground. We are also actively exploring additional avenues of aid through various border crossings. Working alongside local partners and the World Food Programme, we are presently active in the Middle Area including Deir Al Balah, Zawayda, and Al Nusairat, as well Khan Younis and Rafah.</span></p><p><strong style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Empowering Education Through CPPF (OMAR BARZAK SCHOLARSHIP):</strong></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Our collaboration with the Canadian Palestinian Professional Foundation (CPPF) focuses on nurturing academic excellence and leadership in Palestine. Through scholarship funding and support, we are shaping the future generation by enabling them to pursue education and professional growth. Join us in fostering brighter prospects for these talented students.</span></p><p><strong style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Enhancing Neonatal Care in London:</strong></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Babies in the NICU require constant monitoring and precise control of their environment, down to the degree, as well as frequent testing to prioritize their constant medical needs and complications. In order to ensure that NICU babies – who often weigh less than a stick of butter – can be safely transported to different procedure and assessment rooms along with all their equipment, Children’s needs a replacement NICU shuttle. Children’s Hospital would like to purchase a new NICU shuttle, to replace a decommissioned model. This state-of-the-art shuttle makes it possible for an infant’s developmentally supportive “microenvironment” – comprised of incubators, ventilators, IV’s and more - to move with them. Vulnerable infants can be transported quickly and easily to assessments and procedures without fear of worsening their condition or experiencing loss of power to vital equipment.</span></p><p><br></p><p><strong style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">YOUR IMPACT MATTERS</strong></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">Your contributions have already shown incredible results. Last year, your generosity helped us raise over $160,000 for essential medical equipment and furnishings for the maternity department at Al-Shifa hospital in Gaza. This achievement was made possible by the dedication of over 4000 attendees across Canada who united to support Palestine's most vulnerable populations.</span></p><p><strong style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">TOGETHER WE CAN ACHIEVE MORE</strong></p><p><span style="background-color: rgb(255, 255, 255); color: rgb(111, 114, 135);">With your continued support, we aim to strengthen healthcare systems, provide vital equipment, essential drugs, and offer capacity-building support to medical professionals. Your donations enable us to conduct in-person and online medical training, ensuring that care providers have the knowledge they need to save lives.</span></p><p><br></p>', '09:00:00', '18:30:00');

      INSERT INTO admin_events (admin_id, event_id) VALUES 
      (28, 18),
      (28, 21),
      (28, 19);

      INSERT INTO sellers (event_id, stripe_account_id) VALUES 
      (18, 'acct_1PjiO0PrmmTBuL3x'),
      (19, 'acct_1PjiO0PrmmTBuL3x'),
      (21, 'acct_1PjiO0PrmmTBuL3x');

      INSERT INTO orders (order_number, event_id, total, first_name, last_name, email, phone_number, t_shirt_size, created_at, user_id) VALUES 
      ('pi_3Pk4w4LArihKr4Gb1Ai2kuwA', 18, 2614, 'Bara', 'Banat', 'sccassociationlondon@gmail.com', '2265031072', 'Medium', '2024-08-04 09:57:25.891448', 5),
      ('pi_3Pk515LArihKr4Gb1HRMIwxz', 18, 2614, 'sara', 'Banat', 'sccassociationlondon@gmail.com', '2265031072', 'Medium', '2024-08-04 10:02:36.883453', 5),
      ('pi_3Pk52MLArihKr4Gb1cCAnVSU', 18, 2614, 'wafa', 'Banat', 'sccassociationlondon@gmail.com', '2265031072', 'X-Large', '2024-08-04 10:03:55.863543', 5),
      ('pi_3Pk5BnLArihKr4Gb1YEWfy21', 21, 3817, 'Bara', 'Banat', 'sccassociationlondon@gmail.com', '2265031072', 'X-Large', '2024-08-04 10:13:40.700198', 5),
      ('pi_3Pk5GTLArihKr4Gb1fo8mSZK', 19, 4419, 'Bara', 'Banat', 'sccassociationlondon@gmail.com', '2265031072', 'Large', '2024-08-04 10:18:30.789511', 5),
      ('pi_3Pk5OCLArihKr4Gb1OHb8jJn', 21, 3817, 'Bara', 'Banat', 'sccassociationlondon@gmail.com', '2265031072', 'Medium', '2024-08-04 10:26:29.636454', 5),
      ('pi_3Pk5QnLArihKr4Gb0o5QJjmJ', 21, 3817, 'yara', 'Banat', 'sccassociationlondon@gmail.com', '2265031072', 'Small', '2024-08-04 10:29:10.770288', 5),
      ('pi_3Pk6TtLArihKr4Gb0Zsk8FwJ', 18, 2614, 'Sara', 'Banat', 'saradeya28@gmail.com', '2262243952', 'Small', '2024-08-04 11:36:27.241785', 6),
      ('pi_3Pk7l6LArihKr4Gb0mfoiM2S', 21, 3817, 'Bara', 'Banat', 'sccassociationlondon@gmail.com', '2265031072', 'Medium', '2024-08-04 12:58:18.024552', 18),
      ('pi_3Pk8YaLArihKr4Gb0dB5eIUb', 21, 3817, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Medium', '2024-08-04 13:49:25.286088', 5),
      ('pi_3Pk8bBLArihKr4Gb19R7hHog', 19, 4419, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Small', '2024-08-04 13:52:07.106137', 5),
      ('pi_3Pk8j8LArihKr4Gb0AhUlEJb', 21, 3817, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Medium', '2024-08-04 14:00:19.925779', 5),
      ('pi_3Pk8nmLArihKr4Gb17IYBYGh', 21, 3817, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Medium', '2024-08-04 14:05:07.798778', 5),
      ('pi_3Pk8qXLArihKr4Gb1UyBGKL6', 19, 4419, 'Sara', 'Banat', 'saradeya06@gmail.com', '2265031072', 'Small', '2024-08-04 14:07:59.179665', 6),
      ('pi_3Pk8yYLArihKr4Gb0J09qaXS', 21, 3817, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Medium', '2024-08-04 14:16:15.338299', 6),
      ('pi_3Pk91jLArihKr4Gb1j3L5LgZ', 21, 3817, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Medium', '2024-08-04 14:19:32.862691', 6),
      ('pi_3Pk95ULArihKr4Gb1SpoMs5C', 21, 3817, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Small', '2024-08-04 14:23:25.91057', 6),
      ('pi_3Pk99OLArihKr4Gb1SLg3AUF', 21, 3817, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Medium', '2024-08-04 14:27:27.841705', 6),
      ('pi_3Pk9BALArihKr4Gb0QjaOEX2', 18, 2614, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Medium', '2024-08-04 14:29:17.390082', 6),
      ('pi_3Pk9EDLArihKr4Gb1sJWu5Z7', 21, 3817, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Medium', '2024-08-04 14:32:26.409541', 6),
      ('pi_3Pk9KFLArihKr4Gb16U1HQat', 21, 3817, 'Sara', 'Banat', 'saradeya28@gmail.com', '2262243952', 'Small', '2024-08-04 14:38:41.074501', 6),
      ('pi_3PkBjZLArihKr4Gb0iGhvclM', 19, 4419, 'Bara', 'Banat', 'sccassociationlondon@gmail.com', '2265031072', 'Medium', '2024-08-04 17:12:59.227447', 5),
      ('pi_3PkBkDLArihKr4Gb1zhtpWOF', 19, 4419, 'Bara', 'Banat', 'banatbara0@gmail.com', '2265031072', 'Small', '2024-08-04 17:13:38.756284', 5);
    `);
  } catch (err) {
    console.error('Error running migration:', err);
  } finally {
    await pool.end();
  }
};

migrate();
