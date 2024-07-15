const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const PORT = 3000;

// Initialize Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.db'
});

// Define the model
const CurrencyPair = sequelize.define('CurrencyPair', {
    baseCurrency: {
        type: DataTypes.STRING,
        allowNull: false
    },
    targetCurrency: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create a new currency pair
app.post('/api/currency-pairs', async (req, res) => {
    try {
        const { baseCurrency, targetCurrency } = req.body;
        const pair = await CurrencyPair.create({ baseCurrency, targetCurrency });
        res.json(pair);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save currency pair' });
    }
});

// Get all currency pairs
app.get('/api/currency-pairs', async (req, res) => {
    try {
        const pairs = await CurrencyPair.findAll();
        res.json(pairs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch currency pairs' });
    }
});

// Sync database and start server
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.log('Failed to sync database:', err));