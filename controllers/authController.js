const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const handleLogin = async (req,res) => {
    const {user, pwd} = req.body;
    if (!user || !pwd) return res.status(400).json({'message':'Username and password are required.'});
    
    // check if username exists
    const foundUser = await User.findOne({username:user}).exec();

    if (!foundUser){
        return res.sendStatus(401); //unauthorized
    }

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTS
        const accessToken = jwt.sign(
            {"UserInfo": {
                "username": foundUser.username,
                "roles": roles
            }},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'}
        );
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        
        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // max age is 1 day
        res.json({accessToken}); // store in memory not local or cookies ; so front end dev can grab
    } else {
        res.sendStatu(401); // unauthorized
    }
};

    

 module.exports = {handleLogin};
// no nested pgs in final
// no hypervisor on final