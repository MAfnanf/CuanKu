document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const welcomeText = document.querySelector('header h2');
    const profileButton = document.querySelector('.profile');
    const logoutDropdown = document.querySelector('.logout-dropdown');
    const logoutButton = document.getElementById('logout'); // Ambil tombol logout
    
    // Menampilkan pesan selamat datang atau default
    if (username) {
        welcomeText.textContent = `Selamat Datang, ${username}!`;
    } else {
        welcomeText.textContent = 'Selamat Datang, User!';
    }

    // Cek status login dan buat event listener
    profileButton.addEventListener('click', (e) => {
        if (username) {
            // Jika user sudah login, tampilkan dropdown logout
            logoutDropdown.classList.toggle('show');
        } else {
            // Jika tidak ada akun yang login, redirect ke halaman login
            window.location.href = 'Login/login.html';
        }
    });

    // Fungsi logout
    logoutButton.addEventListener('click', () => {
        // Hapus data user dari localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        
        // Redirect ke halaman login setelah logout
        window.location.href = 'Login/login.html'; // Ganti dengan path yang sesuai
    });

    // Expense chart
    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Study', 'Invest'],
            datasets: [{
                data: [400, 100, 96],
                backgroundColor: ['#36D7B7', '#FF9F9F', '#9B89FF']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Transaction data
    const transactions = [
        {
            date: '4 Des',
            day: 'Rabu',
            items: [
                { description: 'Steak + Milkshake', amount: -400000, icon: 'icon_makanan.png' },
                { description: 'Investasi Bibit', amount: -96000, icon: 'icon_invest.png' }
            ]
        },
        {
            date: '3 Des',
            day: 'Selasa',
            items: [
                { description: 'Beli React Course', amount: -100000, icon: 'icon_edu.png' }
            ]
        },
        {
            date: '2 Des',
            day: 'Senin',
            items: [
                { description: 'Uang Bulanan', amount: 1000000, icon: 'icon_income.png' }
            ]
        }
    ];

    // Populate transaction list
    const transactionList = document.getElementById('transactionList');
    transactions.forEach(transaction => {
        const transactionDate = document.createElement('div');
        transactionDate.innerHTML = `<strong>${transaction.date} ${transaction.day}</strong>`;
        transactionList.appendChild(transactionDate);

        transaction.items.forEach(item => {
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
                <div>
                    <img src="images/${item.icon}" alt="${item.description}">
                    ${item.description}
                </div>
                <span class="amount ${item.amount > 0 ? 'positive' : 'negative'}">
                    ${item.amount.toLocaleString()}
                </span>
            `;
            transactionList.appendChild(transactionItem);
        });
    });
});
