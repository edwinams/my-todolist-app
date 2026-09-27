let todos = [];
const API_URL = '/api/todos';

// 1. Pengaturan Tema Gelap
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

if(localStorage.getItem('theme') === 'dark') {
    body.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
    if(body.hasAttribute('data-theme')) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
});

// 2. Mengambil Data Awal
async function fetchTodos() {
    const loader = document.getElementById('loader');
    loader.classList.remove('hidden');
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        // Jika data bukan array, jadikan array kosong
        todos = Array.isArray(data) ? data : [];
        renderTodos();
    } catch (err) {
        console.error("Gagal mengambil data", err);
    } finally {
        loader.classList.add('hidden');
    }
}

// 3. Render HTML
function renderTodos() {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    
    // Sortir: Tugas yang belum selesai di atas
    const sortedTodos = [...todos].sort((a, b) => a.completed - b.completed);

    sortedTodos.forEach((todo) => {
        // Cari index asli dari array utama
        const originalIndex = todos.indexOf(todo); 
        
        const li = document.createElement('li');
        li.className = `priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <span style="flex:1; cursor:pointer;" onclick="toggleTodo(${originalIndex})">${todo.text}</span>
            <div class="actions">
                <button onclick="deleteTodo(${originalIndex})">Hapus</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// 4. Menyimpan Perubahan ke Server
async function saveTodos() {
    try {
        await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todos)
        });
    } catch (err) {
        console.error("Gagal menyimpan data", err);
    }
}

// 5. Interaksi User (Tambah, Selesai, Hapus)
document.getElementById('todo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const priority = document.getElementById('priority-input');

    todos.unshift({ // Tambah di paling atas
        text: input.value,
        priority: priority.value,
        completed: false
    });

    input.value = '';
    renderTodos();
    await saveTodos();
});

window.toggleTodo = async (index) => {
    todos[index].completed = !todos[index].completed;
    renderTodos();
    await saveTodos();
};

window.deleteTodo = async (index) => {
    todos.splice(index, 1);
    renderTodos();
    await saveTodos();
};

// Jalankan saat pertama dimuat
fetchTodos();
