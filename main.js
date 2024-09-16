fetch('/api/getTop10')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('data-body');
        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.name}</td>
                <td>${row.last}</td>
                <td>${row.buy}</td>
                <td>${row.sell}</td>
                <td>${row.volume}</td>
                <td>${row.base_unit}</td>
            `;
            tableBody.appendChild(tr);
        });
    });
    .catch(error => console.error('Error fetching data:', error));
