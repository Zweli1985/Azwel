const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from 'public'
app.use(express.static('public'));

// Serve Index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Index.html'));
});

// Image Upload Setup
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('./public/uploads')) {
    fs.mkdirSync('./public/uploads', { recursive: true });
}

// API Endpoints
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, message: 'Image uploaded', imageUrl });
});

app.post('/api/payment', (req, res) => {
    const { destination, checkin, checkout, guests, amount } = req.body;
    if (destination && checkin && checkout && guests && amount) {
        res.json({ success: true, message: `Payment of R${amount} processed for ${destination} (Mock)` });
    } else {
        res.status(400).json({ success: false, message: 'Invalid booking details' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});