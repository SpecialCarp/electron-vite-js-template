const { app, BrowserWindow } = require('electron');

function handleAppEvents(mainWindow) {
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
}

module.exports = handleAppEvents;
