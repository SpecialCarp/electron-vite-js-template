// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, protocol } = require('electron');
const { release } = require('node:os');
// const path = require('path');
const createWindow = require('./main-process/createWindow.cjs');
const setupIPCHandlers = require('./main-process/ipcHandlers.cjs');
const handleAppEvents = require('./main-process/appEvents.cjs');

/*
 * process.env.NODE_ENV用在正式项目中，此值有可能是undefined
 * 可用electron的app.isPackaged代替判断是否开发环境
 * app.isPackaged返回一个boolean值，如果应用已经打包，返回true ，否则返回false 。 对于大多数应用程序，此属性可用于区分开发和生产环境。
 */
const isDev = !app.isPackaged;
// process.env.NODE_ENV === 'development' ? true : false;

protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { secure: true, standard: true, stream: true } },
]);

// 禁用 Windows 7 的 GPU 加速
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// 为 Windows 10+ 通知设置应用程序名称
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
	app.quit();
	process.exit(0);
}

let mainWindow = null;
// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady()
	.then(() => {
		createWindow({}, isDev).then(win => {
			mainWindow = win;
		});
	})
	.then(() => {
		setupIPCHandlers();
	})
	.then(() => {
		handleAppEvents(mainWindow);
	});
