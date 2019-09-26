const electron = require('electron');
const {app, BrowserWindow, Menu, Tray} = require('electron');
const path = require('path');

const title = 'BBC 6music';

let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'pepflashplayer.dll'
    break
  case 'darwin':
    pluginName = 'PepperFlashPlayer.plugin'
    break
  case 'linux':
    pluginName = 'libpepflashplayer.so'
    break
}

app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));
app.commandLine.appendSwitch('ppapi-flash-version', '18.0.0.203');

let mainWindow, tray;

function createWindow () {
  // Create the browser window.
  const workArea = electron.screen.getPrimaryDisplay().workArea;

  const width = 380;
  const height = 665;

  mainWindow = new BrowserWindow({
    show: false,
    width: width,
    height: height,
    x: workArea.width - width,
    y: 0,
    useContentSize: true,
    toolbar: false,
    resizeable: false,
    'web-preferences': {'plugins': true}
  });

  const contextMenu = Menu.buildFromTemplate([
    {label: title, click: () => {
      mainWindow.show();
    }},
    {type: 'separator'},
    {role: 'quit'},
  ]);

  tray = new Tray(__dirname + '/app/tray.png');
  tray.setToolTip(title);
  tray.on('click', function() {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  tray.setContextMenu(contextMenu);
  mainWindow.on('show', () => {
    tray.setHighlightMode('selection');
  });
  mainWindow.on('hide', () => {
    tray.setHighlightMode('never');
  });

  // and load the index.html of the app.
  var url = 'file://' + __dirname + '/app/index.html';
  //url = 'http://www.mstorm.net/toy/user-agent';
  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  });

  // Emitted when the window is closed.
  mainWindow.on('close', function (e) {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null;
    // app.quit()
    e.preventDefault();
    mainWindow.hide();
  })
}

app.setName(title);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('before-quit', e => {
  mainWindow.removeAllListeners('close');
  mainWindow = null;
});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
