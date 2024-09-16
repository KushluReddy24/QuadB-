const express = require('express');
const path = require('path');
const fetch=require('node-fetch')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./crypto.db');
const app = express();
const PORT = 3001;
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS prices (
        name TEXT,
        last REAL,
        buy REAL,
        sell REAL,
        volume REAL,
        base_unit TEXT
    )`);
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/getTop10', (req, res) => {
    db.all('SELECT * FROM prices LIMIT 10', [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});
const updateDatabase = () => {
    fetch('https://api.wazirx.com/api/v2/tickers')
        .then(response => response.json())
        .then(data => {
            const top10 = Object.values(data).slice(0, 10); // Adjust based on actual API structure

            db.serialize(() => {
                // Clear old data
                db.run('DELETE FROM prices');

                // Insert new data
                const stmt = db.prepare('INSERT INTO prices (name, last, buy, sell, volume, base_unit) VALUES (?, ?, ?, ?, ?, ?)');

                top10.forEach(item => {
                    stmt.run(
                        item.name,
                        item.last,
                        item.buy,
                        item.sell,
                        item.volume,
                        item.base_unit
                    );
                });

                stmt.finalize();
            });
        })
       .catch(err => console.error('Error fetching data:', err));
};

// Update database every 5 minutes
updateDatabase();
setInterval(updateDatabase, 5 * 60 * 1000); // 5 minutes in milliseconds

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



