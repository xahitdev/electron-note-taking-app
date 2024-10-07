const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;


app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 600,
        height: 600,
        minHeight: 600,
        minWidth: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Enable IPC
        },
    });

    mainWindow.loadFile('index.html');

});

// Handle reading notes from JSON
ipcMain.handle('load-notes', () => {
    const filePath = path.join(__dirname, 'notes.json');
    if (!fs.existsSync(filePath)) {
        return []; // If no file, return empty array
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
});

// Handle saving notes to JSON
ipcMain.handle('save-notes', (event, notes) => {
    const filePathWriting = path.join(__dirname, 'notes.json');
    fs.writeFileSync(filePathWriting, JSON.stringify(notes, null, 2));
});
