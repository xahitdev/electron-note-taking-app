const { ipcRenderer } = require('electron');
const { webFrame } = require('electron');

const noteInput = document.getElementById('note-input');
const notesList = document.getElementById('notes-list');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const settingsBtn = document.getElementById('settings-button');

let notes = [];
let editIndex = -1; // Used to track if we're editing a note

webFrame.setZoomFactor(1.5);

// Load notes on startup
document.addEventListener('DOMContentLoaded', async () => {
    notes = await ipcRenderer.invoke('load-notes'); // Load notes from file
    displayNotes(); // Display the loaded notes
});

// Save notes
saveBtn.addEventListener('click', async () => {
    const noteText = noteInput.value;
    if (noteText) {
        const timestamp = new Date(); // Get current date and time
        const note = {
            text: noteText,
            date: timestamp.toLocaleDateString(), // Format date
            time: timestamp.toLocaleTimeString()  // Format time
        };

        if (editIndex === -1) {
            // Add new note at the beginning if not editing
            notes.unshift(note); // Use unshift to add to the beginning
        } else {
            // Update the note if we're editing
            notes[editIndex] = note;
            editIndex = -1; // Reset after editing
        }

        await ipcRenderer.invoke('save-notes', notes);
        displayNotes();
        noteInput.value = ''; //clean 
    }
});

// removed because program loading notes in the beggining 
// Load notes button (optional, can be removed if you want auto-load only)
loadBtn.addEventListener('click', async () => {
    notes = await ipcRenderer.invoke('load-notes');
    displayNotes();
});

// Display
function displayNotes() {
    notesList.innerHTML = ''; // Clear previous display

    notes.forEach((note, index) => {
        const noteCell = document.createElement('div');
        noteCell.className = 'note-cell';

        const noteText = document.createElement('p');
        noteText.textContent = note.text;

        const noteTimestamp = document.createElement('small'); // To show date and time
        noteTimestamp.textContent = `${note.date} at ${note.time}`;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            editIndex = index; // Set the edit index to the clicked note
            noteInput.value = note.text; // Populate the input field with the note text for editing
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', async () => {
            await deleteNote(index); // Delete note when clicked
        });

        noteCell.appendChild(noteText);
        noteCell.appendChild(noteTimestamp); // Append timestamp to note cell
        noteCell.appendChild(editBtn);
        noteCell.appendChild(deleteBtn);
        notesList.appendChild(noteCell);
    });
}

// Function to delete a note
async function deleteNote(index) {
    notes.splice(index, 1); // Remove the note from the array
    await ipcRenderer.invoke('save-notes', notes); // Save the updated notes
    displayNotes(); // Refresh the displayed notes
}
