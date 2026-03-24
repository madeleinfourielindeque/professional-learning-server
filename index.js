const express = require('express');
const app = express();
const PORT = 3000;

const API_KEY = "my-secret-key";

app.use(express.json());

// Public route
app.get('/', (req, res) => {
    res.json({ message: 'Professional Learning API is running' });
});

// Protected route with API key
app.get('/api/resources', (req, res) => {
    const key = req.headers['x-api-key'];

    if (key !== API_KEY) {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    res.json([
        { id: 1, title: 'Learning Design Basics' },
        { id: 2, title: 'Facilitation Toolkit' }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});