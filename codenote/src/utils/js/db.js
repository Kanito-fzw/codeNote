class DB {
    db = null

    constructor() {
        // 打开数据库,如果不存在则创建
        var request = window.indexedDB.open('codeNoteDB', '1')

        request.onupgradeneeded = (event) => {// 新建数据库触发
            this.db = event.target.result
            var objectStore;
            if (!this.db.objectStoreNames.contains('markdown')) {//判断表是否存在,不存在则创建
                objectStore = this.db.createObjectStore('markdown', {keyPath: 'id'});
            }
        }

        request.onerror = (event) => {// 数据库打开错误
            console.log('打开失败')
        }

        request.onsuccess = (event) => {// 数据库打开正常
            console.log('打开成功')
            this.db = event.target.result
        }
    }

    //查
    getContent(id, successFunc) {
        let context = this.db.transaction(['markdown'], 'readwrite')
            .objectStore('markdown')
            .get(id)
        context.onerror = () => {
            successFunc('markdown文件读取失败')
        }
        context.onsuccess = () => {
            successFunc(context.result.content)
        }
    }

    //增
    postContent(id, content) {
        this.db.transaction(['markdown'], 'readwrite')
            .objectStore('markdown')
            .add({id: id, content: content})
    }

    //改
    putContent(id, content) {
        this.db.transaction(['markdown'], 'readwrite')
            .objectStore('markdown')
            .put({id: id, content: content})
    }

    //删
    deleteContent(id) {
       const deleteResult=this.db.transaction(['markdown'], 'readwrite')
            .objectStore('markdown')
            .delete(id)
    }

    //模糊查询
    getAllContent(keyWord, successFunc) {
        let allContent = this.db.transaction('markdown').objectStore('markdown')
        allContent.openCursor().onsuccess = (event) => {
            var cursor = event.target.result;
            const data = []
            if (cursor) {
                if (cursor.value.content.indexOf(keyWord) >= 0) {
                    data.push(cursor.value)
                }
            } else {
                successFunc(data)
                // console.log('没有更多数据了！');
            }
        }
    }
}

export default new DB()






