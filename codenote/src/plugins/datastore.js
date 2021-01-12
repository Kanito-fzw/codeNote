// import Datastore from 'lowdb'
// import FileSync from 'lowdb/adapters/FileSync'
// import path from 'path'
// import fs from 'fs-extra'
// import { app } from 'electron'
//
// const STORE_PATH = app.getPath('userData') // 获取electron应用的用户目录
//
// if (process.type !== 'renderer') {
//     if (!fs.pathExistsSync(STORE_PATH)) { // 如果不存在路径
//         fs.mkdirpSync(STORE_PATH) // 就创建
//     }
// }
// const adapter = new FileSync(path.join(STORE_PATH, '/data.json')) // 初始化lowdb读写的json文件名以及存储路径
//
// const db = Datastore(adapter) // lowdb接管该文件
//
// export default db // 暴露出去
