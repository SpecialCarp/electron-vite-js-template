const { BrowserWindow, shell } = require('electron');
const path = require('path');

async function createWindow(options, isDev) {
	// console.log(options, isDev);
	// 如果获取不到值，可以先写死接口
	const port = process.env.port || process.env.npm_config_port || 8081; // 端口

	class windowOptions {
		constructor(options) {
			if (!options) {
				options = {};
			}
			this.width = options.width || 1800;
			this.height = options.height || 1800;
			this.minWidth = options.minWidth || 1800;
			this.minHeight = options.minHeight || 1800;
			this.webPreferences = {
				nodeIntegration: true, //在渲染进程启用Node.js
				contextIsolation: true,
				preload: path.join(__dirname, '../preload.cjs'),
				devTools: isDev, // 打包之后禁止打开控制台
			};
		}
	}

	let mainWindow = new BrowserWindow(new windowOptions(options));
	// 加载 index.html
	mainWindow.loadURL(
		isDev
			? `http://localhost:${port}`
			: `file://${path.join(__dirname, '../../dist/index.html')}`
	);

	if (isDev) {
		const installExtension = require('electron-devtools-installer');
		await installExtension.default(installExtension.VUEJS_DEVTOOLS);
		// 打开开发工具
		mainWindow.webContents.openDevTools();
	}
	// Test actively push message to the Electron-Renderer
	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow?.webContents.send('main-process-message', new Date().toLocaleString());
	});

	// Make all links open with the browser, not with the application
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url);
		return { action: 'deny' };
	});
	return mainWindow;
}

module.exports = createWindow;
