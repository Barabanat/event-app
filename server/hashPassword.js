const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = 'superadminbara'; // Replace with your desired password

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log(hash); // This will print the hashed password
});
