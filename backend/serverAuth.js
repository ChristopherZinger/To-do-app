const express = require('express');
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRouters = require('./auth/routes/AuthRoutes')
const { getUser } = require('./myUtils/authUtils/authUtils');
const todoRouters = require('./todos/routes/TodoRoutes');
const todoListsRouters = require('./todos/routes/TodoListsRoutes');


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
app.use(getUser);



// --- AUTH PATHS ---
app.use(authRouters);

// -- TODO PATHS ---
app.use(todoRouters);
app.use(todoListsRouters);



