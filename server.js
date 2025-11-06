const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;  // Render uses $PORT

// Use environment variables for security
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars');
    process.exit(1);
}

app.use(cors());
app.use(express.json());

app.post('/send', async (req, res) => {
    const { name, phone } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ message: 'Name and phone are required' });
    }

    const message = `New Contact:\nName: ${name}\nPhone: ${phone}`;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
        });
        res.json({ message: 'Data sent successfully!' });
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        res.status(500).json({ message: 'Error sending data to Telegram' });
    }
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Graceful shutdown for Render
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
