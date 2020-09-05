const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
// const authenticateToken = require('./myUtils/authUtils/authenticateToken');
const cookieParser = require('cookie-parser');
const authRouters = require('./auth/routes/AuthRoutes')
// set up env variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Set up mongo db 
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', err => console.log(err));
db.once('open', () => {
    console.log('Connection with mongoDG ready!');
    app.listen(4000);
    console.log('Server Started.');
});


// MIDDLEWARE
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true,
    }
));
app.use(express.json());
app.use(cookieParser())


// --- AUTH PATHS ---
app.use(authRouters)

// -- TODO PATHS ---
// const todoRouters = require('./routers/apiTodo/apiTodoRouters');
// todoRouters(app);

