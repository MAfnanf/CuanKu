import { db } from "../firebaseConfig.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

let isSubmitting = false;

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
    console.log('Document loaded');
    const transactionType = document.getElementById('transactionType');
    const categoryIcons = document.getElementById('categoryIcons');
    const submitButton = document.getElementById('submitTransaction');

    // Initial render of categories
    console.log('Rendering initial categories (expenseCategories)');
    renderCategories(expenseCategories);

    // Handle transaction type change
    transactionType.addEventListener('change', (e) => {
        console.log('Transaction type changed:', e.target.value);
        const categories = e.target.value === 'Pengeluaran' ? expenseCategories : incomeCategories;
        renderCategories(categories);
        selectedCategory = null;
        console.log('Selected category reset to null');
    });

    // Handle form submission
    submitButton.addEventListener('click', handleSubmit);
});

function renderCategories(categories) {
    console.log('Rendering categories:', categories);
    const categoryIcons = document.getElementById('categoryIcons');
    categoryIcons.innerHTML = '';

    categories.forEach(category => {
        console.log('Adding category:', category);
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
    console.log('Category selected:', element.dataset.category);
    // Remove selection from previously selected category
    const previouslySelected = document.querySelector('.category-item.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
        console.log('Removed selection from previous category:', previouslySelected.dataset.category);
    }

    // Add selection to clicked category
    element.classList.add('selected');
    selectedCategory = element.dataset.category;
    console.log('New selected category:', selectedCategory);
}

async function handleSubmit() {
    console.log('Submit button clicked');
    const amount = document.getElementById('amount').value;
    const details = document.getElementById('details').value;
    const type = document.getElementById('transactionType').value;

    console.log('Form inputs:', { amount, details, type, selectedCategory });

    if (isSubmitting) {
        console.log('Submission in progress. Aborting.');
        return;
    }

    if (!amount || !details || !selectedCategory) {
        console.error('Validation failed: Missing fields');
        alert('Please fill in all fields and select a category');
        return;
    }

    isSubmitting = true; // Only set this after validating inputs
    console.log('Starting submission');

    const transaction = {
        type,
        amount: parseFloat(amount),
        category: selectedCategory,
        details,
        date: new Date().toISOString()
    };

    console.log('Transaction object to save:', transaction);

    try {
        // Save data to Firestore
        const docRef = await addDoc(collection(db, 'transactions'), transaction);
        console.log('Transaction saved with ID:', docRef.id);
        alert('Transaction saved successfully!');

        // Reset form
        document.getElementById('amount').value = '';
        document.getElementById('details').value = '';
        const selectedCategoryElement = document.querySelector('.category-item.selected');
        if (selectedCategoryElement) {
            selectedCategoryElement.classList.remove('selected');
            console.log('Cleared selection from category');
        }
        selectedCategory = null;
    } catch (error) {
        console.error('Error saving transaction:', error);
        alert('Failed to save transaction.');
    } finally {
        isSubmitting = false; // Always reset the flag
        console.log('Submission completed');
    }
}
