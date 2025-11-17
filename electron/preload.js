const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openApp: (appName) => ipcRenderer.invoke('open-app', appName),
  systemCommand: (command) => ipcRenderer.invoke('system-command', command),
  openUrl: (url) => ipcRenderer.invoke('open-url', url),
  sendEmail: (emailData) => ipcRenderer.invoke('send-email', emailData),
  openFolder: (folderName) => ipcRenderer.invoke('open-folder', folderName),
  
  // System info
  platform: process.platform,
  versions: process.versions
});