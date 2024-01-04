const { ipcRenderer } = require('electron');

function sendMessage()  {
    console.log('接收到消息');
    ipcRenderer.invoke('sendMessage', {
        title: 'My App',
        body: 'Hello, this is a notification!',
    });
}

module.exports = {
    sendMessage
}
