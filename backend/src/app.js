// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
// const partiesRoutes = require('./routes/partiesRoutes');
// const invoicesRoutes = require('./routes/invoicesRoutes');
// const dashboardRoutes = require('./routes/dashboardRoutes');

const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ ok: true, app: 'SIISA backend' }));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
// app.use('/api/parties', partiesRoutes);
// app.use('/api/invoices', invoicesRoutes);
// app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

module.exports = app; // THIS MUST EXIST
