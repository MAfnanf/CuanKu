import { db } from "./firebaseConfig.js";
import { collection, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    const welcomeText = document.querySelector('header h2');
    const profileButton = document.querySelector('.profile');
    const logoutDropdown = document.querySelector('.logout-dropdown');
    const logoutButton = document.getElementById('logout');
    const transactionList = document.getElementById('transactionList');
    const balanceElement = document.querySelector('.balance .amount');

    if (username) {
        welcomeText.textContent = `Selamat Datang, ${username}!`;
    } else {
        welcomeText.textContent = 'Selamat Datang, User!';
    }

    profileButton.addEventListener('click', (e) => {
        if (username) {
            logoutDropdown.classList.toggle('show');
        } else {
            window.location.href = 'Login/login.html';
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.href = 'Login/login.html';
    });

    // Global variable for chart instance
    let expenseChart;

    // Function to calculate the chart data dynamically
    function calculateChartData(transactions) {
        const categoryData = {};

        transactions.forEach(transaction => {
            const amount = transaction.amount;
            const category = transaction.category.toLowerCase();

            if (!categoryData[category]) {
                categoryData[category] = 0;
            }

            if (transaction.type === 'Pemasukan') {
                categoryData[category] += amount; // Pemasukan
            } else {
                categoryData[category] -= amount; // Pengeluaran
            }
        });

        // Return the formatted data for the chart
        const labels = Object.keys(categoryData);
        const data = Object.values(categoryData).map(value => Math.abs(value));
        return { labels, data };
    }

    // Function to render or update the chart
    function renderChart(transactions) {
        const { labels, data } = calculateChartData(transactions);

        const colors = labels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);

        if (expenseChart) {
            // Update the chart if it already exists
            expenseChart.data.labels = labels;
            expenseChart.data.datasets[0].data = data;
            expenseChart.data.datasets[0].backgroundColor = colors;
            expenseChart.update();
        } else {
            // Create a new chart
            const ctx = document.getElementById('expenseChart').getContext('2d');
            expenseChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    function renderTransactions(transactions) {
        let totalBalance = 0;
        transactionList.innerHTML = ''; // Clear the list to avoid duplication

        transactions.reverse().forEach((transaction) => {
            const amount = transaction.amount;
            const type = transaction.type;

            totalBalance += type === 'Pemasukan' ? amount : -amount;

            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
                <div class="transaction-content">
                    <div class="transaction-info">
                        <img src="images/${getIconForCategory(transaction.category)}" alt="${transaction.category}">
                        ${transaction.details} (${transaction.category}) - Sumber: ${transaction.source || 'Unknown'}
                    </div>
                    <span class="amount ${type === 'Pemasukan' ? 'positive' : 'negative'}">
                        Rp ${Math.abs(amount).toLocaleString()}
                    </span>
                    <button class="delete-btn" data-id="${transaction.id}">
                        <img src="images/tabler-trash.png" alt="Delete"> Hapus
                    </button>
                </div>
            `;

            const deleteBtn = transactionItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => deleteTransaction(e, transaction.id));

            transactionList.appendChild(transactionItem);
        });

        balanceElement.textContent = `Rp ${totalBalance.toLocaleString()}`;
    }

    function getIconForCategory(category) {
        const iconMap = {
            'food': 'food-icon.png',
            'invest': 'invest-icon.png',
            'education': 'edu-icon.png',
            'income': 'income-icon.png',
            'beauty': 'beauty-icon.png',
            'shopping': 'shopping-icon.png',
            'repair': 'repair-icon.png',
            'travelling': 'travelling-icon.png',
            'investments': 'investment-icon.png',
            'saving': 'saving-icon.png',
            'part-time': 'part-time-icon.png'
        };
        return iconMap[category.toLowerCase()] || 'other-icon.png';
    }

    async function deleteTransaction(e, id) {
        e.stopPropagation();
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            try {
                await deleteDoc(doc(db, 'transactions', id));
                // The onSnapshot listener will update the UI automatically
            } catch (error) {
                console.error("Error deleting transaction:", error);
                alert('Gagal menghapus transaksi.');
            }
        }
    }

    // Fetch transactions and render chart
    const unsubscribe = onSnapshot(collection(db, 'transactions'), (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        renderTransactions(transactions); // Update transaction list
        renderChart(transactions); // Update chart with dynamic data
    });
});
