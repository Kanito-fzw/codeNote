'use strict'

import {app, protocol, BrowserWindow, Menu, dialog, ipcMain} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'

const isDevelopment = process.env.NODE_ENV !== 'production'
import fs from 'fs-extra'
import path from 'path'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])
let win

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
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
const template = [
    {
        label: '文件',
        submenu: [

            {
                label: '导入文件',
                click: () => {
                    dialog.showOpenDialog({
                        filters: [
                            {
                                name: 'MD文件',
                                extensions: ['md']
                            }
                        ],
                        properties: ['openFile'],
                        message: '选择要导入的Mackdown文件',
                        buttonLabel: '导入'
                    }).then((result) => {
                        fs.readFile(path.join(result.filePaths[0]), 'utf8', (err, data) => {
                            if (err) {
                                win.webContents.send('import-markdown-message', '读取失败');
                            } else {
                                win.webContents.send('import-markdown-message', result.filePaths[0], data);
                            }
                        })
                    })


                }
            },
            {
                type: 'separator'
            },
            {
                label: '导出文件',
                click: () => {
                    win.webContents.send('export-markdown');
                }
            },
            {
                label: '全部导出',
                click: () => {
                    console.log('替换');
                }
            },

            {
                type: 'separator'
            },
            {
                label: '关闭',
                click: () => {
                    win.close();
                }
            }
        ]
    },
    {
        label: '编辑',
        submenu: [
            {
                label: '撤销',
                role: 'undo'
            },
            {
                label: '重做',
                role: 'redo'
            },
            {
                label: '复制',
                role: 'copy'
            },
            {
                label: '粘贴',
                role: 'paste'
            },
            {
                label: '剪切',
                role: 'cut'
            },
            {
                type: 'separator'
            },
            {
                label: '查找',
                accelerator: 'Command+F',
                click: () => {
                    console.log('查找');
                }
            },
            {
                label: '替换',
                accelerator: 'Command+R',
                click: () => {
                    console.log('替换');
                }
            }

        ]
    },
    {
        label: '关于',
        role: 'about'
    },
    {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function (item, focusedWindow) {
            if (focusedWindow)
                focusedWindow.reload();
        }
    },
    {
        label: 'Toggle Developer Tools',
        accelerator: (function () {
            if (process.platform == 'darwin') return 'Alt+Command+I'; else
                return 'Ctrl+Shift+I';
        })(),
        click: function (item, focusedWindow) {
            if (focusedWindow)
                focusedWindow.toggleDevTools();
        }
    },
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
//单实例
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // 当运行第二个实例时,将会聚焦到myWindow这个窗口
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        } else {
            // 创建 myWindow, 加载应用的其余部分, etc...
            app.on('ready', () => {
                createWindow()
            })
        }
    })

}
let exportCount = 0

function outPutMarkDown(data, rootPath) {
    if (data.children) {
        let newPath = rootPath + '/' + data.label
        fs.mkdir(path.join(rootPath, data.label), {recursive: true}, (err) => {
        })
        for (let i = 0; i < data.children.length; i++) {
            outPutMarkDown(data.children[i], newPath)
        }
    } else {
        exportCount++
        fs.writeFile(path.join(rootPath, data.label + '.md'), data.content, 'utf8', (err) => {
        })
    }
}

//创建markdown目录
ipcMain.on('output-markdown-message', function (event, arg) {
    exportCount = 0
    dialog.showOpenDialog({
        properties: ['openDirectory'],
        message: '选择导出目录',
        buttonLabel: '导出'
    }).then((result) => {
        outPutMarkDown(arg, result.filePaths[0])
    }).finally(() => {
        event.sender.send('output-markdown-reply',exportCount);
    })

});


