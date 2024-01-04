const { ipcMain, Notification } = require('electron');

function setupIPCHandlers() {
	ipcMain.handle('sendMessage', (event, msgData) => {
		if (Notification.isSupported()) {
			if (!msgData) {
				return;
			}
			const notify = new Notification({
				title: msgData.title ? msgData.title : 'My electronApp',
				body: msgData.body ? msgData.body : 'Hello, Electron + Vite!',
			});
			notify.show();
		}
	});
	// New window example arg: new windows url
	ipcMain.handle('open-win', (_, arg) => {
		const childWindow = new BrowserWindow({
			webPreferences: {
				preload,
				nodeIntegration: true,
				contextIsolation: false,
			},
		});
		if (process.env.VITE_DEV_SERVER_URL) {
			childWindow.loadURL(`http://localhost:${port}#${arg}`);
		} else {
			childWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: arg });
		}
	});
}

module.exports = setupIPCHandlers;
