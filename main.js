const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { createSecureContext } = require('tls');

let mainWindow;
let settingsWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 960,
        minHeight: 800,
        minWidth: 600,
        icon: path.join(__dirname, 'media/favicon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Enable IPC
        },
    });

    mainWindow.loadFile('index.html');

});
function openSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 400,
        height: 400,
        minHeight: 400,
        minWidth: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Enable IPC
        },

    });
    settingsWindow.loadFile('settings.html');
}

ipcMain.on('settings-btn', () => {
    if (!settingsWindow) {
        openSettingsWindow();
    }
    else {
        settingsWindow.focus();
    }
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
