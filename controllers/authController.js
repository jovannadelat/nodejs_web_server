const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req,res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) return res.status(400).json({'message':'Username and password are required.'});
    
    // check if username exists
    const foundUser = usersDB.users.find(person => person.username === user);

    if (!foundUser){
        return res.sendStatus(401); //unauthorized
    }

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // create JWTS
        const accessToken = jwt.sign(
            {"username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        // Saving refreshToken with current user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken};
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // max age is 1 day
        res.json({accessToken}); // store in memory not local or cookies ; so front end dev can grab
    } else {
        res.sendStatu(401); // unauthorized
    }
};

    

 module.exports = {handleLogin};
// no nested pgs in final
// no hypervisor on final