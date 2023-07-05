
import { app, BrowserWindow } from 'electron';
import path from 'path';

// 创建窗口
const createWindow = async () => {
    const win = new BrowserWindow({
        width: 1100,
        height: 800,
        icon: "../public/images/apiLogo.ico",
        //渲染进程预设
        webPreferences: {
            // nodeIntegration: true, // 开启在渲染进程中融入node
            // contextIsolation:false, // 关闭上下文隔离
            // enableRemoteModule:true,  // 开启可在渲染进程中直接引入node模块
            sandbox: false, // 开启关闭沙箱模式
            webviewTag:true,  // 开启webview
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    // 消除electron控制台警告
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

    // 加载页面
    if (app.isPackaged) {
        await win.loadFile(path.join(__dirname, "../dist/index.html"));
    } else {
        await win.loadURL(`${process.env['VITE_DEV_SERVER_URL']}`)
    }

    // 加载页面完打开开发者工具
    win.webContents.openDevTools({mode: 'bottom'});

    // 页面加载完成
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('main-process-message', (new Date).toLocaleString())
    })
};



// 应用程序开始运行
app.on('ready', async ()=>{
    // 创建窗口并加载 Vite 页面
    await createWindow();

    // 当所有窗口都被关闭时
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });
    // app退出时
    app.on('will-quit', () => {
    });
});



// 在 macOS 上，当应用程序没有窗口时，重新激活该应用程序的行为
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
