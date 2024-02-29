let totalAmount = 0;

const categorySelect = document.getElementById('category-select')
const amountInput = document.getElementById('amount-input')
const dateInput = document.getElementById('date-input')
const addBtn = document.getElementById('add-btn')
const expenseTableBody = document.getElementById('expense-table-body')
const totalAmountCell = document.getElementById('total-amount')

// Function to fetch and display transactions
const fetchTransactions = async () => {
    try {
        const response = await fetch('/transactions');
        const transactions = await response.json();

        // Clear previous data
        expenseTableBody.innerHTML = '';
        totalAmount = 0;

        // Display transactions in table
        transactions.forEach(transaction => {
            totalAmount += transaction.amount;
            const row = document.createElement('tr');
            // Format the date using JavaScript Date object methods
            const formattedDate = new Date(transaction.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            row.innerHTML = `
                <td>${transaction.description}</td>
                <td>${transaction.amount}</td>
                <td>${formattedDate}</td> <!-- Display formatted date -->
                <td><button class="delete-btn" data-id="${transaction._id}">Delete</button></td>
            `;
            expenseTableBody.appendChild(row);
        });

        totalAmountCell.textContent = totalAmount;
    } catch (error) {
        console.error('Error fetching transactions:', error.message);
    }
};

// Function to add a new transaction
const addTransaction = async () => {
    const description = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value; // Use the date input value directly

    if (!description || isNaN(amount) || !date) {
        alert('Please enter valid data.');
        return;
    }

    try {
        const response = await fetch('/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description, amount, date })
        });

        if (response.ok) {
            fetchTransactions();
            
            // Clear input fields after successfully adding transaction
            categorySelect.value = '';
            amountInput.value = '';
            dateInput.value = ''; // Optionally, clear the date input field as well
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error adding transaction:', error.message);
    }
};

// Function to delete a transaction
const deleteTransaction = async (id) => {
    try {
        const response = await fetch(`/transactions/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchTransactions();
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    } catch (error) {
        console.error('Error deleting transaction:', error.message);
    }
};

// Event listener for add button
addBtn.addEventListener('click', addTransaction);

// Event delegation for delete buttons
expenseTableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        deleteTransaction(id);
    }
});

// Initial fetch of transactions
fetchTransactions();
