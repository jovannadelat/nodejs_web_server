const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

// access current json file : replaced with mango 
const fsPromises = require('fs').promises;
const path = require('path');


const handleLogout = async (req,res) => {
    // on client, also delete the access token

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // no content
    const refreshToken = cookies.jwt;

    // is refreshToken in db
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

    if (!foundUser){
        res.clearCookie('jwt', {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        return res.sendStatus(204); // no content
    }

    // Delete refreshToken in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshtToken: ''};
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
                path.join(__dirname, '..', 'model', 'users.json'),
                JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // secure: true - only serves on https (in production)

    res.sendStatus(204);
    

        
}

    

 module.exports = {handleLogout}
// no nested pgs in final
// no hypervisor on final