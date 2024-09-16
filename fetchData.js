const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./crypto.db');

function fetchData() {
    axios.get('https://api.wazirx.com/api/v2/tickers')
        .then(response => {
            const tickers = Object.values(response.data).slice(0, 10);
            db.serialize(() => {
                db.run('DELETE FROM prices');
                let stmt = db.prepare('INSERT INTO prices VALUES (?, ?, ?, ?, ?, ?)');
                tickers.forEach(ticker => {
                    stmt.run(ticker.name, ticker.last, ticker.buy, ticker.sell, ticker.volume, ticker.base_unit);
                });
                stmt.finalize();
            });
        })
        .catch(error => console.log(error));
}
fetchData();
setInterval(fetchData, 60000);  // Fetch data every minute
//
