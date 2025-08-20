const { app, BrowserWindow, shell } = require('electron');
const { fork } = require('child_process');
const path = require('path');

let mainWindow;
let nextServerProcess = null;

function startNextStandaloneServer() {
  // In production, run the compiled Next.js server from .next/standalone/server.js
  const resourcesPath = process.resourcesPath || process.cwd();
  // When packaged by electron-builder, extraResources are placed directly under resourcesPath
  const serverJsPath = path.join(resourcesPath, '.next', 'standalone', 'server.js');

  nextServerProcess = fork(serverJsPath, [], {
    cwd: resourcesPath,
    env: { ...process.env, NODE_ENV: 'production', PORT: '3000' },
    stdio: 'inherit'
  });

  process.on('exit', () => {
    if (nextServerProcess) nextServerProcess.kill();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  mainWindow.loadURL(startUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  if (!process.env.ELECTRON_START_URL) {
    startNextStandaloneServer();
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
