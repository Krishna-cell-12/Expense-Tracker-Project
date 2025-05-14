document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expenseForm');
    const expenseList = document.getElementById('expenseList');
    const totalAmountSpan = document.getElementById('totalAmount');
    let totalAmount = 0;
    let expenses = [];

    // Load expenses from localStorage if available
    if (localStorage.getItem('expenses')) {
        expenses = JSON.parse(localStorage.getItem('expenses'));
        expenses.forEach(expense => {
            addExpenseToDOM(expense);
            totalAmount += expense.amount;
        });
        updateTotal();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const description = document.getElementById('description').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;

        if (!description || isNaN(amount) || amount <= 0) {
            alert('Please enter valid description and amount');
            return;
        }

        const expense = {
            id: Date.now(),
            description,
            amount,
            category,
            date: new Date().toLocaleDateString()
        };

        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));

        addExpenseToDOM(expense);
        totalAmount += amount;
        updateTotal();

        form.reset();
        document.getElementById('description').focus();
    });

    function addExpenseToDOM(expense) {
        const li = document.createElement('li');
        
        // Category colors
        const categoryColors = {
            food: '#4cc9f0',
            transport: '#4895ef',
            housing: '#4361ee',
            entertainment: '#3f37c9',
            shopping: '#7209b7',
            other: '#f72585'
        };
        
        li.innerHTML = `
            <div>
                ${expense.description} 
                <span class="category-tag" style="background-color: ${categoryColors[expense.category]}">
                    ${expense.category}
                </span>
                <small>${expense.date}</small>
            </div>
            <div>
                <span>$${expense.amount.toFixed(2)}</span>
                <button class="delete-btn" data-id="${expense.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        expenseList.appendChild(li);
    }

    function updateTotal() {
        totalAmountSpan.textContent = totalAmount.toFixed(2);
        
        // Change color based on total amount
        if (totalAmount > 500) {
            totalAmountSpan.style.color = '#f72585';
        } else if (totalAmount > 200) {
            totalAmountSpan.style.color = '#4895ef';
        } else {
            totalAmountSpan.style.color = '#4361ee';
        }
    }

    // Event delegation for delete buttons
    expenseList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const id = parseInt(e.target.closest('.delete-btn').dataset.id);
            deleteExpense(id);
        }
    });

    function deleteExpense(id) {
        const expenseIndex = expenses.findIndex(exp => exp.id === id);
        if (expenseIndex > -1) {
            totalAmount -= expenses[expenseIndex].amount;
            expenses.splice(expenseIndex, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            
            // Update DOM
            expenseList.innerHTML = '';
            expenses.forEach(exp => addExpenseToDOM(exp));
            updateTotal();
        }
    }
});