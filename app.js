const cors = require('cors');
require('dotenv').config();

// const env = require('dotenv').config();

const express = require('express');
const app = express();

const flash = require('connect-flash');
app.use(flash());
const session = require('express-session');




const db = require('./config/mongoose-connection');
db();
const cookieParser = require('cookie-parser');



const path = require('path');
const indexRoutes = require('./routes/indexRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

app.set('view engine', 'ejs');
// Increase body size limit here ✅
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(cors({
  origin: "*", // your frontend URL
  credentials: true               // ✅ allow cookies to be sent
}));

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use('/',indexRoutes);
app.use('/owner', ownerRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);

const stripeRoutes = require('./routes/stripeRoutes');
app.use('/api/stripe', stripeRoutes);


module.exports = app;