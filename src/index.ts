import { app, BrowserWindow, Rectangle } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

interface WindowSize {
  bounds?: Rectangle;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  const initPath = path.join(app.getPath('appData'), "init.json");
  let data: WindowSize;
  try {
    data = JSON.parse(readFileSync(initPath, 'utf8'));
  }
  catch(e) {
    // pass
  }


  // Create the browser window.
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../src/icon@2x.png'),
    ...data?.bounds
  });

  // and load the index.html of the app.
  // mainWindow.loadFile(path.join(__dirname, '../src/index.html'));
  mainWindow.loadURL('https://web.omnifocus.com');

  mainWindow.on("close", function() {
    writeFileSync(initPath, JSON.stringify({
      bounds: mainWindow.getBounds()
    }));
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
