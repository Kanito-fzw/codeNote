'use strict'

import {app, protocol, BrowserWindow, ipcMain} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'
import fs from 'fs-extra'
import path from 'path'


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            // 在electron 10.0.0之后，remote模块默认关闭
            // 必须手动设置webPreferences中的enableRemoteModule为true之后才能使用
            enableRemoteModule: true, // 这里是关键设置
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

//创建markdown目录
ipcMain.on('create-markdownIndex-message', function (event, mdPath) {
    // 这里是传给渲染进程的数据
    fs.mkdir(path.join(__dirname, mdPath), {recursive:true},(err) => {
        if (err) {
            event.sender.send('create-markdownIndex-reply', '创建目录失败' + dir);
        } else {
            event.sender.send('create-markdownIndex-reply', '创建目录成功' + dir);
        }
    })
});
//保存markdown文件
ipcMain.on('save-markdownFile-message', function (event, mdPath,content) {
    // 这里是传给渲染进程的数据
    fs.writeFile(path.join(__dirname,mdPath), content,'utf8', (err, data) => {
        if (err) {
            event.sender.send('save-markdownFile-reply', '创建markdown文件失败');
        } else {
            event.sender.send('save-markdownFile-reply', '创建markdown文件成功');
        }
    })
});
//读取markdown文件
ipcMain.on('load-markdownFile-message', function (event, mdPath) {
    // 这里是传给渲染进程的数据
    fs.readFile(path.join(__dirname, mdPath), 'utf8', (err, data) => {
        if (err) {
            event.sender.send('load-markdownFile-reply', '读取失败' );
        } else {
            event.sender.send('load-markdownFile-reply', data);
        }
    })
});
//重命名markdown文件和目录
ipcMain.on('rename -markdownFile-message', function (event, mdPath) {
    // 这里是传给渲染进程的数据
    fs.readFile(path.join(__dirname, mdPath), 'utf8', (err, data) => {
        if (err) {
            event.sender.send('rename -markdownFile-reply', '读取失败' );
        } else {
            event.sender.send('rename -markdownFile-reply', '成功');
        }
    })
});
//删除markdown文件
ipcMain.on('delete -markdownFile-message', function (event, mdPath) {
    // 这里是传给渲染进程的数据
    fs.readFile(path.join(__dirname, mdPath), 'utf8', (err, data) => {
        if (err) {
            event.sender.send('delete -markdownFile-reply', '读取失败');
        } else {
            event.sender.send('delete -markdownFile-reply', '成功');
        }
    })
});

//删除markdown目录
ipcMain.on('delete -markdownIndex-message', function (event, mdPath) {
    // 这里是传给渲染进程的数据
    fs.readFile(path.join(__dirname, mdPath), 'utf8', (err, data) => {
        if (err) {
            event.sender.send('delete -markdownIndex-reply', '失败');
        } else {
            event.sender.send('delete -markdownIndex-reply', '成功');
        }
    })
});
