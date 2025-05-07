const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { email, pwd } = req.body; // Use email instead of username
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });

    // Check for duplicate emails in the database
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) return res.sendStatus(409); // Conflict if email already exists

    try {
        // Encrypt the password using bcrypt
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // Create and store the new user
        const result = await User.create({
            email, // Store email
            password: hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user with email ${email} created!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
};

module.exports = { handleNewUser };
