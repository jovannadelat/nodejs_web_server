const express = require('express');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const { verify } = require('crypto');
const app = express();
const PORT = process.env.PORT || 3500;


// npm i nodemon jsonwebtoke express dotenv uuid bcrypt cookie-parser cors

// custom middleware logger
app.use(logger);

// Cross Orgin Resource Sharing
app.use(cors(corsOptions));

//middle ware for url encoded date : form-data
app.use(express.urlencoded({extended:false}));

// build in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/api/root'));
app.use('/register', require('./routes/api/register'));
app.use('/auth', require('./routes/api/auth'));
app.use('/refresh', require('./routes/api/refresh'));
app.use('/logout', require('./routes/api/logout'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));


// 404 handler — MUST be last
app.all(/.*/, (req, res) => {
    res.status(404);
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    if (req.accepts('json')){
        res.json({error: "404 not found"});
    } else{
        res.type('txt').send('404 not found');
    }
});

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
