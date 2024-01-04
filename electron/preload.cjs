const { ipcRenderer, contextBridge } = require('electron');
const electronApi = require('./preload/electronApi.cjs');

// 使用 contextBridge.exposeInMainWorld 将 ipcRenderer 暴露给渲染进程
contextBridge.exposeInMainWorld('electronAPI', electronApi);

window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector);
		if (element) element.innerText = text;
	};

	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, process.versions[type]);
	}
});

// --------------------------预加载动画----------------------------------
const { domReady, useLoading } = require('./preload/business.cjs');
const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);
window.onmessage = ev => {
	ev.data.payload === 'removeLoading' && removeLoading();
};
setTimeout(removeLoading, 1499);
