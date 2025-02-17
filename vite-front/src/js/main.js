// src/js/main.js
import '../css/style.css';
import { apiRequest, showSnackbar } from './fetch.js';






// --- DIALOG SETUP ---
const dialog = document.querySelector('.info_dialog');
const closeDialogButton = dialog?.querySelector('button');
closeDialogButton?.addEventListener('click', () => {
    dialog.close();
});





// --- 1. FETCH USERS ---
const fetchUsers = async () => {
    try {
        const users = await apiRequest('/users');
        const table = document.getElementById('users-table');

        if (table) {
            table.innerHTML = `
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>ID</th>
                    <th>Info</th>
                    <th>Delete</th>
                </tr>
            `;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.user_id}</td>
                <td><button class="check" data-id="${user.user_id}">Info</button></td>
                <td><button class="del" data-id="${user.user_id}">Delete</button></td>
            `;
            table?.appendChild(row);
        });

        addEventListeners();
    } catch (error) {
        console.error('Error fetching users:', error);
        showSnackbar(`Error fetching users: ${error.message}`);
    }
};

document.getElementById('fetch-users-btn')?.addEventListener('click', fetchUsers);






// --- 2. ADD USER ---
const addUser = async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email    = document.getElementById('email').value.trim();

    try {
        const newUser = await apiRequest('/users', 'POST', { username, password, email });
        showSnackbar(`User ${newUser.username} added successfully!`);
        await fetchUsers(); // refresh user list
    } catch (error) {
        showSnackbar(`Error adding user: ${error.message}`);
    }
};

document.getElementById('add-user-form')?.addEventListener('submit', addUser);





// --- 3. INFO & DELETE BUTTONS ---
function addEventListeners() {
    // "Info" button -> open dialog with user details
    document.querySelectorAll('.check').forEach(button => {
        button.addEventListener('click', async (event) => {
            const userId = event.target.dataset.id;
            try {
                const user = await apiRequest(`/users/${userId}`);
                // Show the dialog
                dialog.showModal();
                // Insert user details into the dialog <p> content
                dialog.querySelector('p').innerHTML = `
                    <div>User ID: <span>${user.user_id}</span></div>
                    <div>Username: <span>${user.username}</span></div>
                    <div>Email: <span>${user.email}</span></div>
                    <div>Role: <span>${user.user_level || 'N/A'}</span></div>
                `;
            } catch (error) {
                showSnackbar(`Error fetching user: ${error.message}`);
            }
        });
    });

    // "Delete" button -> remove user
    document.querySelectorAll('.del').forEach(button => {
        button.addEventListener('click', async (event) => {
            const userId = event.target.dataset.id;
            try {
                await apiRequest(`/users/${userId}`, 'DELETE');
                showSnackbar('User deleted successfully');
                await fetchUsers(); // refresh user list
            } catch (error) {
                showSnackbar(`Error deleting user: ${error.message}`);
            }
        });
    });
}





// --- 4. SEARCH USER BY ID ---
document.getElementById('search-user-btn')?.addEventListener('click', async () => {
    const userId = document.getElementById('search-user-id').value.trim();
    const resultTable = document.getElementById('search-result-table');
    const tbody = resultTable?.querySelector('tbody');

    if (!userId) {
        showSnackbar('Please enter a valid User ID.');
        return;
    }

    try {
        const user = await apiRequest(`/users/${userId}`);
        showSnackbar(`User Found: Username - ${user.username}, Email - ${user.email}`);

        if (tbody) {
            tbody.innerHTML = '';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.user_id}</td>
            `;
            tbody.appendChild(row);
            resultTable.style.display = 'table';
        }
    } catch (error) {
        showSnackbar(`Error: ${error.message}`);
        if (resultTable) {
            resultTable.style.display = 'none';
        }
    }
});






// -- 5. FETCH DIARY ENTRIES -> CREATE CARDS ---
document.querySelector('.get_entries')?.addEventListener('click', async () => {
  try {
    const entries = await apiRequest('/entries');  // GET /api/entries
    const cardContainer = document.querySelector('.card-area2');
    cardContainer.innerHTML = '';

    entries.forEach(entry => {
      // Format date more nicely
      const dateObj = new Date(entry.entry_date);
      const formattedDate = dateObj.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      // Create outer card
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');

      // Top image
      const imgDiv = document.createElement('div');
      imgDiv.classList.add('card-img');
      imgDiv.innerHTML = `
        <img src="/img/foil.png" alt="Diary Image" />
      `;

      // Text area (2-column grid)
      const diaryDiv = document.createElement('div');
      diaryDiv.classList.add('card-diary');
      diaryDiv.innerHTML = `
        <h4>Entry ID: ${entry.entry_id}</h4>

        <div class="label">Date:</div>
        <div>${formattedDate}</div>

        <div class="label">Mood:</div>
        <div>${entry.mood}</div>

        <div class="label">Weight:</div>
        <div>${entry.weight} kg</div>

        <div class="label">Sleep:</div>
        <div>${entry.sleep_hours} hours</div>

        <div class="label">Notes:</div>
        <div>${entry.notes}</div>
      `;

      // Assemble card
      cardDiv.appendChild(imgDiv);
      cardDiv.appendChild(diaryDiv);

      cardContainer.appendChild(cardDiv);
    });

    showSnackbar(`Fetched ${entries.length} diary entries!`);
  } catch (error) {
    showSnackbar(`Error fetching entries: ${error.message}`);
  }
});







// --- 6. BURGER MENU ---
const burgerMenu = document.getElementById('burger-menu');
if (burgerMenu) {
    burgerMenu.addEventListener('click', () => {
        document.getElementById('nav-links')?.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('nav-links')?.classList.remove('active');
        });
    });
}







// --- 7. BMI CALCULATOR ---
document.getElementById('calculateBtn')?.addEventListener('click', () => {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);

    if (!weight || !height || weight <= 0 || height <= 0) {
        alert('Anna kelvolliset paino- ja pituusarvot.');
        return;
    }

    const bmi = weight / ((height / 100) ** 2);
    const roundedBmi = Math.round(bmi * 10) / 10;
    document.getElementById('bmiValue').textContent = roundedBmi;

    document.getElementById('underweightRow').classList.remove('highlightBmi');
    document.getElementById('normalRow').classList.remove('highlightBmi');
    document.getElementById('overweightRow').classList.remove('highlightBmi');

    let analysisText = '';
    if (bmi < 19) {
        analysisText = 'Alipaino: Painoindeksisi on alle suositellun rajan.';
        document.getElementById('underweightRow').classList.add('highlightBmi');
    } else if (bmi >= 19 && bmi <= 24.9) {
        analysisText = 'Normaali: Painoindeksisi on välillä 19–24.9.';
        document.getElementById('normalRow').classList.add('highlightBmi');
    } else {
        analysisText = 'Ylipaino: Painoindeksisi on 25 tai enemmän.';
        document.getElementById('overweightRow').classList.add('highlightBmi');
    }

    document.getElementById('analysisMessage').textContent = analysisText;
});
