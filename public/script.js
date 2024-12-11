import { db } from "./firebaseConfig.js";
import { collection, getDocs, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

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

    function renderTransactions(transactions) {
        let totalBalance = 0;
        transactionList.innerHTML = ''; // Clear the list to avoid duplication
    
        transactions.forEach((transaction) => {
            const amount = transaction.amount;
            const type = transaction.type;
    
            totalBalance += type === 'Pemasukan' ? amount : -amount;
    
            const transactionItem = document.createElement('div');
            transactionItem.className = 'transaction-item';
            transactionItem.innerHTML = `
                <div class="transaction-content">
                    <div class="transaction-info">
                        <img src="images/${getIconForCategory(transaction.category)}" alt="${transaction.category}">
                        ${transaction.details} (${transaction.category})
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
        return iconMap[category] || 'other-icon.png';
    }

    async function deleteTransaction(e, id) {
        e.stopPropagation();
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            try {
                await deleteDoc(doc(db, 'transactions', id));
                // No need to call fetchTransactions here as the listener will update the list
            } catch (error) {
                console.error("Error deleting transaction:", error);
                alert('Gagal menghapus transaksi.');
            }
        }
    }

    // Set up a real-time listener for transactions
    const unsubscribe = onSnapshot(collection(db, 'transactions'), (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderTransactions(transactions);
    });

    // Clean up the listener when the page is unloaded
    window.addEventListener('unload', () => unsubscribe());
});

