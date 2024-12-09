const expenseCategories = [
    { id: 'food', name: 'Food', icon: '../images/food-icon.png' },
    { id: 'invest', name: 'Invest', icon: '../images/invest-icon.png' },
    { id: 'education', name: 'Education', icon: '../images/edu-icon.png' },
    { id: 'beauty', name: 'Beauty', icon: '../images/beauty-icon.png' },
    { id: 'shopping', name: 'Shopping', icon: '../images/shopping-icon.png' },
    { id: 'repair', name: 'Repair', icon: '../images/repair-icon.png' },
    { id: 'travelling', name: 'Travelling', icon: '../images/travelling-icon.png' },
    { id: 'other', name: 'Other', icon: '../images/other-icon.png' }
];

const incomeCategories = [
    { id: 'income', name: 'Income', icon: '../images/income-icon.png' },
    { id: 'investments', name: 'Investments', icon: '../images/investment-icon.png' },
    { id: 'saving', name: 'Saving', icon: '../images/saving-icon.png' },
    { id: 'part-time', name: 'Part-Time', icon: '../images/part-time-icon.png' },
    { id: 'other', name: 'Other', icon: '../images/other-income-icon.png' }
];

let selectedCategory = null;

document.addEventListener('DOMContentLoaded', () => {
    const transactionType = document.getElementById('transactionType');
    const categoryIcons = document.getElementById('categoryIcons');
    const submitButton = document.getElementById('submitTransaction');

    // Initial render of categories
    renderCategories(expenseCategories);

    // Handle transaction type change
    transactionType.addEventListener('change', (e) => {
        const categories = e.target.value === 'Pengeluaran' ? expenseCategories : incomeCategories;
        renderCategories(categories);
        selectedCategory = null;
    });

    // Handle form submission
    submitButton.addEventListener('click', handleSubmit);
});

function renderCategories(categories) {
    const categoryIcons = document.getElementById('categoryIcons');
    categoryIcons.innerHTML = '';

    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-item';
        categoryElement.dataset.category = category.id;
        
        categoryElement.innerHTML = `
            <img src="${category.icon}" alt="${category.name}">
            <span>${category.name}</span>
        `;

        categoryElement.addEventListener('click', () => selectCategory(categoryElement));
        categoryIcons.appendChild(categoryElement);
    });
}

function selectCategory(element) {
    // Remove selection from previously selected category
    const previouslySelected = document.querySelector('.category-item.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    // Add selection to clicked category
    element.classList.add('selected');
    selectedCategory = element.dataset.category;
}

function handleSubmit() {
    const amount = document.getElementById('amount').value;
    const details = document.getElementById('details').value;
    const type = document.getElementById('transactionType').value;

    // Validate form
    if (!amount || !details || !selectedCategory) {
        alert('Please fill in all fields and select a category');
        return;
    }

    // Create transaction object
    const transaction = {
        type,
        amount: parseFloat(amount),
        category: selectedCategory,
        details,
        date: new Date().toISOString()
    };

    // For now, just show success message
    alert('Transaction saved successfully!');

    // Reset form
    document.getElementById('amount').value = '';
    document.getElementById('details').value = '';
    const selectedCategoryElement = document.querySelector('.category-item.selected');
    if (selectedCategoryElement) {
        selectedCategoryElement.classList.remove('selected');
    }
    selectedCategory = null;
}