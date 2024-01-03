// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, shell, ipcMain, protocol } = require('electron');
const { release } = require('node:os');
const path = require('path');
/*
 * process.env.NODE_ENV用在正式项目中，此值有可能是undefined
 * 可用electron的app.isPackaged代替判断是否开发环境
 * app.isPackaged返回一个boolean值，如果应用已经打包，返回true ，否则返回false 。 对于大多数应用程序，此属性可用于区分开发和生产环境。
 */
const isDev = process.env.NODE_ENV === 'development' ? true : false;
/*
 * 如果获取不到值，可以先写死接口
 */
const port = process.env.port || process.env.npm_config_port || 8081; // 端口

protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true, stream: true } },
]);
// 禁用 Windows 7 的 GPU 加速
if (release().startsWith('6.1')) app.disableHardwareAcceleration();
// 为 Windows 10+ 通知设置应用程序名称
if (process.platform === 'win32') app.setAppUserModelId(app.getName());
//
if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}
let mainWindow = null;
function createWindow() {
	// 创建浏览器窗口
	mainWindow = new BrowserWindow({
		width: 1800,
		height: 1600,
		minWidth: 1000,
		minHeight: 800,
		webPreferences: {
			nodeIntegration: true, //在渲染进程启用Node.js
			contextIsolation: false,
			preload: path.join(__dirname, 'preload.js'),
		},
	});
	// 加载 index.html
	mainWindow.loadURL(
		isDev ? `http://localhost:${port}` : `file://${path.join(__dirname, '../dist/index.html')}`
	);
	if (isDev) {
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
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(createWindow);
app.on('activate', function () {
	// 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
	// 打开的窗口，那么程序会重新创建一个窗口。
	const allWindows = BrowserWindow.getAllWindows();
	if (allWindows.length) {
		allWindows[0].focus();
	} else {
		createWindow();
	}
});
app.on('second-instance', () => {
	if (mainWindow) {
		// Focus on the main window if the user tried to open another
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
	}
});
// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
	mainWindow = null;
	if (process.platform !== 'darwin') app.quit();
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
