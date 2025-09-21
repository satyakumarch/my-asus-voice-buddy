const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#000000',
      symbolColor: '#ffffff'
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for system control
ipcMain.handle('open-app', async (event, appName) => {
  return new Promise((resolve, reject) => {
    let command;
    
    switch (appName.toLowerCase()) {
      case 'calc':
      case 'calculator':
        command = 'calc';
        break;
      case 'notepad':
        command = 'notepad';
        break;
      case 'explorer':
      case 'file-explorer':
        command = 'explorer';
        break;
      case 'cmd':
      case 'command-prompt':
        command = 'cmd';
        break;
      case 'taskmgr':
      case 'task-manager':
        command = 'taskmgr';
        break;
      case 'control':
      case 'control-panel':
        command = 'control';
        break;
      case 'mspaint':
      case 'paint':
        command = 'mspaint';
        break;
      case 'winword':
      case 'word':
        command = 'winword';
        break;
      case 'excel':
        command = 'excel';
        break;
      case 'powerpnt':
      case 'powerpoint':
        command = 'powerpnt';
        break;
      default:
        command = appName;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error opening ${appName}:`, error);
        reject(`Failed to open ${appName}: ${error.message}`);
      } else {
        resolve(`Successfully opened ${appName}`);
      }
    });
  });
});

ipcMain.handle('system-command', async (event, command) => {
  return new Promise((resolve, reject) => {
    let cmd;
    
    switch (command.toLowerCase()) {
      case 'shutdown':
        cmd = 'shutdown /s /t 0';
        break;
      case 'restart':
      case 'reboot':
        cmd = 'shutdown /r /t 0';
        break;
      case 'sleep':
        cmd = 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0';
        break;
      case 'lock':
        cmd = 'rundll32.exe user32.dll,LockWorkStation';
        break;
      default:
        reject(`Unknown system command: ${command}`);
        return;
    }

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${command}:`, error);
        reject(`Failed to execute ${command}: ${error.message}`);
      } else {
        resolve(`Successfully executed ${command}`);
      }
    });
  });
});

ipcMain.handle('open-url', async (event, url) => {
  const { shell } = require('electron');
  try {
    await shell.openExternal(url);
    return `Opened ${url}`;
  } catch (error) {
    throw new Error(`Failed to open URL: ${error.message}`);
  }
});

ipcMain.handle('send-email', async (event, emailData) => {
  const { shell } = require('electron');
  const { to, subject, body } = emailData;
  
  try {
    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    await shell.openExternal(mailtoUrl);
    return `Email composition opened for ${to}`;
  } catch (error) {
    throw new Error(`Failed to open email composer: ${error.message}`);
  }
});