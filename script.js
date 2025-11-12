// Load subjects from localStorage
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderSubjects();
});

// Add a new subject
function addSubject() {
    const subjectInput = document.getElementById('subjectName');
    const subjectName = subjectInput.value.trim();

    if (subjectName === '') {
        alert('Please enter a subject name');
        return;
    }

    // Check if subject already exists
    if (subjects.some(subject => subject.name.toLowerCase() === subjectName.toLowerCase())) {
        alert('This subject already exists!');
        return;
    }

    const newSubject = {
        id: Date.now(),
        name: subjectName,
        attended: 0,
        left: 0
    };

    subjects.push(newSubject);
    saveSubjects();
    renderSubjects();
    subjectInput.value = '';
}

// Delete a subject
function deleteSubject(id) {
    if (confirm('Are you sure you want to delete this subject?')) {
        subjects = subjects.filter(subject => subject.id !== id);
        saveSubjects();
        renderSubjects();
    }
}

// Update attended count
function updateAttended(id) {
    const input = document.getElementById(`attended-${id}`);
    const value = parseInt(input.value) || 0;

    if (value < 0) {
        alert('Please enter a positive number');
        return;
    }

    const subject = subjects.find(s => s.id === id);
    if (subject) {
        subject.attended += value;
        saveSubjects();
        renderSubjects();
    }
}

// Update left count
function updateLeft(id) {
    const input = document.getElementById(`left-${id}`);
    const value = parseInt(input.value) || 0;

    if (value < 0) {
        alert('Please enter a positive number');
        return;
    }

    const subject = subjects.find(s => s.id === id);
    if (subject) {
        subject.left += value;
        saveSubjects();
        renderSubjects();
    }
}

// Calculate attendance percentage
function calculatePercentage(attended, left) {
    const total = attended + left;
    if (total === 0) return 0;
    return ((attended / total) * 100).toFixed(2);
}

// Save subjects to localStorage
function saveSubjects() {
    localStorage.setItem('subjects', JSON.stringify(subjects));
}

// Render all subjects
function renderSubjects() {
    const container = document.getElementById('subjectsContainer');

    if (subjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📝 No subjects added yet. Add your first subject above!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = subjects.map(subject => {
        const percentage = calculatePercentage(subject.attended, subject.left);
        const percentageColor = percentage >= 75 ? '#28a745' : percentage >= 50 ? '#ffc107' : '#dc3545';

        return `
            <div class="subject-card">
                <div class="subject-header">
                    <h3 class="subject-name">${subject.name}</h3>
                    <button class="delete-btn" onclick="deleteSubject(${subject.id})">Delete</button>
                </div>

                <div class="percentage-box" style="background: ${percentageColor};">
                    <div class="percentage-label">Attendance Percentage</div>
                    <div class="percentage-value">${percentage}%</div>
                </div>

                <div class="stats">
                    <div class="stat-box attended">
                        <div class="stat-label">Classes Attended</div>
                        <div class="stat-value">${subject.attended}</div>
                    </div>
                    <div class="stat-box left">
                        <div class="stat-label">Classes Left</div>
                        <div class="stat-value">${subject.left}</div>
                    </div>
                </div>

                <div class="attendance-controls">
                    <input 
                        type="number" 
                        id="attended-${subject.id}" 
                        placeholder="Add attended" 
                        min="0"
                    />
                    <input 
                        type="number" 
                        id="left-${subject.id}" 
                        placeholder="Add left" 
                        min="0"
                    />
                </div>

                <div class="button-group">
                    <button class="btn-action btn-attended" onclick="updateAttended(${subject.id})">
                        ✓ Add Attended
                    </button>
                    <button class="btn-action btn-left" onclick="updateLeft(${subject.id})">
                        ✗ Add Left
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Allow Enter key to add subject
document.addEventListener('DOMContentLoaded', () => {
    const subjectInput = document.getElementById('subjectName');
    subjectInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addSubject();
        }
    });
});
