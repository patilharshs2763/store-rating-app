const express = require('express');
const db = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/usersRoutes');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoute');
const dashboardStat = require('./routes/dashboardRoutes');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', storeRoutes);
app.use('/api', ratingRoutes);
app.use('/api', dashboardStat);

db.authenticate()
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log('Error while connection', err));

app.listen(PORT, () => {
    console.log("Application is running on port", PORT);
});