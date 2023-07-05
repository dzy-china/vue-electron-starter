
import  { contextBridge ,ipcRenderer}   from 'electron'

// 暴露给渲染进程的数据，通过：window.main获取
contextBridge.exposeInMainWorld('main',{
    ipcRenderer: {...ipcRenderer},
    expressPort: process.env.expressPort,
})