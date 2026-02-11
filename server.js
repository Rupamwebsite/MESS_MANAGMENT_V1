const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`\n✨ Server is running!\n`);
    console.log(`🌐 Local:   http://localhost:${PORT}`);
    console.log(`📱 Network: http://192.168.x.x:${PORT}\n`);
    console.log(`Press Ctrl+C to stop the server\n`);
});
