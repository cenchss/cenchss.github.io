/**
 * Example backend server for the betting prediction site
 * Run this on your friend's homeserver
 *
 * Setup:
 * 1. npm init -y
 * 2. npm install express cors
 * 3. node server.js
 *
 * Then update config.js in the frontend to point to this server's URL
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Data file path
const DATA_FILE = path.join(__dirname, 'picks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// Helper to read picks
function readPicks() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Helper to write picks
function writePicks(picks) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(picks, null, 2));
}

// GET /api/picks - Get all picks
app.get('/api/picks', (req, res) => {
    try {
        const picks = readPicks();
        res.json(picks);
    } catch (error) {
        console.error('Error reading picks:', error);
        res.status(500).json({ error: 'Failed to read picks' });
    }
});

// GET /api/picks/:username - Get picks for a specific user
app.get('/api/picks/:username', (req, res) => {
    try {
        const picks = readPicks();
        const userPicks = picks.find(p => p.username.toLowerCase() === req.params.username.toLowerCase());

        if (userPicks) {
            res.json(userPicks);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error reading picks:', error);
        res.status(500).json({ error: 'Failed to read picks' });
    }
});

// POST /api/picks - Save picks for a user
app.post('/api/picks', (req, res) => {
    try {
        const { username, picks, timestamp } = req.body;

        if (!username || !picks) {
            return res.status(400).json({ error: 'Username and picks are required' });
        }

        const allPicks = readPicks();

        // Find existing user or create new entry
        const existingIndex = allPicks.findIndex(p => p.username.toLowerCase() === username.toLowerCase());

        const userData = {
            username,
            picks,
            timestamp: timestamp || new Date().toISOString()
        };

        if (existingIndex >= 0) {
            allPicks[existingIndex] = userData;
        } else {
            allPicks.push(userData);
        }

        writePicks(allPicks);
        res.json({ success: true, message: 'Picks saved successfully' });
    } catch (error) {
        console.error('Error saving picks:', error);
        res.status(500).json({ error: 'Failed to save picks' });
    }
});

// DELETE /api/picks/:username - Delete picks for a user
app.delete('/api/picks/:username', (req, res) => {
    try {
        const picks = readPicks();
        const filteredPicks = picks.filter(p => p.username.toLowerCase() !== req.params.username.toLowerCase());

        if (filteredPicks.length === picks.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        writePicks(filteredPicks);
        res.json({ success: true, message: 'Picks deleted successfully' });
    } catch (error) {
        console.error('Error deleting picks:', error);
        res.status(500).json({ error: 'Failed to delete picks' });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  GET    /api/picks          - Get all picks`);
    console.log(`  GET    /api/picks/:username - Get picks for a user`);
    console.log(`  POST   /api/picks          - Save picks for a user`);
    console.log(`  DELETE /api/picks/:username - Delete picks for a user`);
});
