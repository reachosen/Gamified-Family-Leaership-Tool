document.addEventListener('DOMContentLoaded', () => {
    const journalForm = document.getElementById('journalForm');
    const journalEntries = document.getElementById('journalEntries');
    const routineForm = document.getElementById('routineForm');
    const newRoutineItem = document.getElementById('newRoutineItem');
    const routineList = document.getElementById('routineList');

    let entries = [];
    let routines = [];

    // Journal functionality
    journalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addJournalEntry();
    });

    function addJournalEntry() {
        const newEntry = {
            date: document.getElementById('entryDate').value,
            title: document.getElementById('entryTitle').value,
            content: document.getElementById('entryContent').value,
            outcome: document.getElementById('entryOutcome').value,
            reason: document.getElementById('entryReason').value,
            emotions: document.getElementById('entryEmotions').value,
            lessons: document.getElementById('entryLessons').value
        };

        entries.push(newEntry);
        renderJournalEntries();
        saveJournalEntries();
        journalForm.reset();

        // Update user stats
        user.xp += 10;
        user.credits += 5;
        checkLevelUp();
        updateUserInfo();
        updateProgressBar();
    }

    function renderJournalEntries() {
        journalEntries.innerHTML = '';
        entries.forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.classList.add('journalEntry');
            entryElement.innerHTML = `
                <h3>${entry.title}</h3>
                <p class="entryDate">${entry.date}</p>
                <p><strong>Content:</strong> ${entry.content}</p>
                <p><strong>Primary Outcome:</strong> ${entry.outcome}</p>
                <p><strong>Essential Reason:</strong> ${entry.reason}</p>
                <p><strong>Emotions and Their Impact:</strong> ${entry.emotions}</p>
                <p><strong>Lessons Learned and Future Actions:</strong> ${entry.lessons}</p>
            `;
            journalEntries.appendChild(entryElement);
        });
    }

    function saveJournalEntries() {
        localStorage.setItem('journalEntries', JSON.stringify(entries));
    }

    function loadJournalEntries() {
        const savedEntries = localStorage.getItem('journalEntries');
        if (savedEntries) {
            entries = JSON.parse(savedEntries);
            renderJournalEntries();
        }
    }

    // Routine functionality
    routineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addRoutineItem();
    });

    function addRoutineItem() {
        const itemText = newRoutineItem.value.trim();
        if (itemText) {
            const newItem = { text: itemText, completed: false };
            routines.push(newItem);
            renderRoutineList();
            newRoutineItem.value = '';
            saveRoutines();
        }
    }

    function renderRoutineList() {
        routineList.innerHTML = '';
        routines.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''}>
                <span>${item.text}</span>
                <button>Delete</button>
            `;
            
            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => {
                item.completed = checkbox.checked;
                saveRoutines();
                updateConsistency();
            });

            const deleteBtn = li.querySelector('button');
            deleteBtn.addEventListener('click', () => {
                routines.splice(index, 1);
                renderRoutineList();
                saveRoutines();
                updateConsistency();
            });

            routineList.appendChild(li);
        });
    }

    function saveRoutines() {
        localStorage.setItem('routines', JSON.stringify(routines));
    }

    function loadRoutines() {
        const savedRoutines = localStorage.getItem('routines');
        if (savedRoutines) {
            routines = JSON.parse(savedRoutines);
            renderRoutineList();
        }
    }

    function updateConsistency() {
        const completedCount = routines.filter(item => item.completed).length;
        const totalCount = routines.length;
        const consistency = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        
        user.xp += completedCount;
        user.credits += completedCount;
        
        checkLevelUp();
        updateUserInfo();
        updateProgressBar();
    }

    // User data and gamification
    let user = {
        name: 'Leader',
        level: 1,
        xp: 0,
        credits: 0
    };

    function loadUserData() {
        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
            user = JSON.parse(savedUser);
        }
    }

    function saveUserData() {
        localStorage.setItem('userData', JSON.stringify(user));
    }

    function updateUserInfo() {
        document.getElementById('username').textContent = user.name;
        document.getElementById('level').textContent = `Level ${user.level}`;
        document.getElementById('credits').textContent = `${user.credits} Credits`;
        saveUserData();
    }

    function checkLevelUp() {
        const xpToNextLevel = user.level * 100;
        if (user.xp >= xpToNextLevel) {
            user.level++;
            user.xp -= xpToNextLevel;
            alert(`Congratulations! You've reached level ${user.level}!`);
        }
    }

    function updateProgressBar() {
        const xpToNextLevel = user.level * 100;
        const progress = (user.xp / xpToNextLevel) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
    }

    // Initialize the app
    loadUserData();
    loadJournalEntries();
    loadRoutines();
    updateUserInfo();
    updateProgressBar();

    // Navigation
    const navButtons = document.querySelectorAll('nav button');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.id.replace('Btn', 'Section');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetId).classList.add('active');
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});