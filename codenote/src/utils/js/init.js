import Vue from 'vue'
import store from '../../store'
class initPage {

    constructor() {

       let configData= window.localStorage.getItem('configData')
        let configItems={
            startWithWindow:false,
            mode: 'ir',
            preview: {
                hljs: {
                    style: 'vs'
                }
            },
            toolbar:[
                'headings',
                'bold',
                'italic',
                'strike',
                'link',
                'upload',
                'list',
                'ordered-list',
                'check',
                'quote',
                'line',
                'table',
                'code',
                'inline-code',
                'fullscreen',
                'export',
                {
                    name: 'more',
                    toolbar: [
                        'edit-mode',
                        'both',
                        'code-theme',
                        'content-theme',
                        'preview',
                        'info',
                        'help',
                    ],
                }
            ]

        }
        if (!configData||!configData.mode){
            window.localStorage.setItem('configData',JSON.stringify(configItems))
        }
    }
    getLocalStorage(key){
        let item = JSON.parse(window.localStorage.getItem(key));
        return item

    }
    setLocalStorage(key,value){
        window.localStorage.setItem(key, JSON.stringify(value))

    }

}

export default new initPage()






