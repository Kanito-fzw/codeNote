<template>
  <div className="order">
    <el-breadcrumb>
      <el-breadcrumb-item v-for="item in breadcrumb">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div id="vditor" @contextmenu="rightClick"></div>
    <button @click="update_markdownFile">saveMd</button>
    <button @click="load_markdownFile">loadMd</button>
    <div class="el-dropdown-menu"
        slot="dropdown"
        :style="style"
        v-show="contextMenuVisible"
    >
      <el-dropdown-item >创建文件夹</el-dropdown-item>
    </div>
  </div>
</template>
<script>
import Vditor from "vditor"
import "vditor/dist/index.css"
import VditorPreview from 'vditor/dist/method.min'

const ipcRenderer = window.require('electron').ipcRenderer

VditorPreview.mermaidRender(document)
import $ from 'jquery'

export default {
  data() {
    return {
      contextMenuVisible: false,//显示右键
      titleHtml: '',//大纲
      contentEditor: "",//vditor插件
      breadcrumb: [],//面包屑
      lastId: '',
      x: null,
      y: null,
      style: {
        display: 'none'
      },
    }
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route(to) {
      this.createOutLine()
      if (to.params.id) {
        this.$nextTick(() => {
          //路由id改变时保存文件
          let flag = false
          if (this.lastId === '') {
            this.lastId = to.params.id
          }
          if (to.params.id !== this.lastId) {
            this.update_markdownFile()
            this.lastId = to.params.id
            flag = true
          }
          //获取文件路径
          this.breadcrumb = window.localStorage.getItem('breadLabel').split(">")
          //路由id改变且获取到新路径后,读取文件
          if (flag) {
            this.load_markdownFile()
          }
        })
      }
    },
    contextMenuVisible(val) {
      if (val) {
        document.body.addEventListener('click', this.closRightMenu)
      } else {
        document.body.removeEventListener('click', this.closRightMenu)
      }
    }
  },
  created() {

  },
  mounted() {
    this.contentEditor = new Vditor("vditor", {
      height: document.body.clientHeight - 147,
      anchor: 1,
      tab: '\t',
      mode: 'ir',
      preview: {
        markdown:{
          paragraphBeginningSpace:true
        },
        theme: {current: 'light'},
        hljs: {
          enable: true,
          style: 'vs'
        }
      },
      toolbar: [
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "upload",
        "|",
        "list",
        "ordered-list",
        "check",
        "|",
        "quote",
        "line",
        "table",
        "code",
        "inline-code",
        "|",
        "fullscreen",
        "export",
        {
          name: 'sponsor',
          tipPosition: 's',
          tip: '成为赞助者',
          className: 'right',
          icon: '<svg t="1589994565028" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2808" width="32" height="32"><path d="M506.6 423.6m-29.8 0a29.8 29.8 0 1 0 59.6 0 29.8 29.8 0 1 0-59.6 0Z" fill="#0F0F0F" p-id="2809"></path><path d="M717.8 114.5c-83.5 0-158.4 65.4-211.2 122-52.7-56.6-127.7-122-211.2-122-159.5 0-273.9 129.3-273.9 288.9C21.5 562.9 429.3 913 506.6 913s485.1-350.1 485.1-509.7c0.1-159.5-114.4-288.8-273.9-288.8z" fill="#FAFCFB" p-id="2810"></path><path d="M506.6 926c-22 0-61-20.1-116-59.6-51.5-37-109.9-86.4-164.6-139-65.4-63-217.5-220.6-217.5-324 0-81.4 28.6-157.1 80.6-213.1 53.2-57.2 126.4-88.8 206.3-88.8 40 0 81.8 14.1 124.2 41.9 28.1 18.4 56.6 42.8 86.9 74.2 30.3-31.5 58.9-55.8 86.9-74.2 42.5-27.8 84.3-41.9 124.2-41.9 79.9 0 153.2 31.5 206.3 88.8 52 56 80.6 131.7 80.6 213.1 0 103.4-152.1 261-217.5 324-54.6 52.6-113.1 102-164.6 139-54.8 39.5-93.8 59.6-115.8 59.6zM295.4 127.5c-72.6 0-139.1 28.6-187.3 80.4-47.5 51.2-73.7 120.6-73.7 195.4 0 64.8 78.3 178.9 209.6 305.3 53.8 51.8 111.2 100.3 161.7 136.6 56.1 40.4 88.9 54.8 100.9 54.8s44.7-14.4 100.9-54.8c50.5-36.3 108-84.9 161.7-136.6 131.2-126.4 209.6-240.5 209.6-305.3 0-74.9-26.2-144.2-73.7-195.4-48.2-51.9-114.7-80.4-187.3-80.4-61.8 0-127.8 38.5-201.7 117.9-2.5 2.6-5.9 4.1-9.5 4.1s-7.1-1.5-9.5-4.1C423.2 166 357.2 127.5 295.4 127.5z" fill="#141414" p-id="2811"></path><path d="M353.9 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2812"></path><path d="M659.3 415.6m-33.8 0a33.8 33.8 0 1 0 67.6 0 33.8 33.8 0 1 0-67.6 0Z" fill="#0F0F0F" p-id="2813"></path><path d="M411.6 538.5c0 52.3 42.8 95 95 95 52.3 0 95-42.8 95-95v-31.7h-190v31.7z" fill="#5B5143" p-id="2814"></path><path d="M506.6 646.5c-59.6 0-108-48.5-108-108v-31.7c0-7.2 5.8-13 13-13h190.1c7.2 0 13 5.8 13 13v31.7c0 59.5-48.5 108-108.1 108z m-82-126.7v18.7c0 45.2 36.8 82 82 82s82-36.8 82-82v-18.7h-164z" fill="#141414" p-id="2815"></path><path d="M450.4 578.9a54.7 27.5 0 1 0 109.4 0 54.7 27.5 0 1 0-109.4 0Z" fill="#EA64F9" p-id="2816"></path><path d="M256 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2817"></path><path d="M703.3 502.7a32.1 27.5 0 1 0 64.2 0 32.1 27.5 0 1 0-64.2 0Z" fill="#EFAFF9" p-id="2818"></path></svg>',
          click () {alert('捐赠地址：https://ld246.com/sponsor')},
        },
        {
          name: "more",
          toolbar: [

            "edit-mode",
            "both",
            "code-theme",
            "content-theme",
            "preview",
            "info",
            "help",
          ],
        }
      ],
      toolbarConfig: {
        pin: true
      },
      cache: {
        enable: false
      },
      after: () => {//编辑器渲染完成后填充内容
        this.initPage()
      },
      input: () => {//编辑内容后实时保存并生成大纲
        this.update_markdownFile()
        this.createOutLine()
      }
    })
    this.createOutLine()


    //窗口自适应
    window.onresize = function () {
      document.getElementById('vditor').style.height = document.body.clientHeight - 147 + 'px'
    }
  },
  beforeDestroy() {
    this.update_markdownFile()
  },
  methods: {
    //右键事件
    rightClick(event) {

      // height: 100vh; top: 0px; max-height: calc(100% - 0px); transform: translateX(-100%); width: 256px;
      if ('translateX(0%)'==document.getElementById('leftWrapper').style.transform){
        this.x = event.clientX-parseInt(document.getElementById('leftWrapper').style.width)
      }
      else {
        this.x = event.clientX
      }
      this.newFileShow = true
      this.newFolderShow = true
      this.deleteFileShow = false
      this.y = event.clientY-35
      this.openRightMenu()
    },
    //显示右键
    openRightMenu() {
      this.style = {
        left: this.x + 'px',
        top: this.y + 'px',
        display: this.contextMenuVisible ? 'block' : 'none',
        padding: '0'
      }
      this.contextMenuVisible = true
    },
    //隐藏右键
    closRightMenu() {
      this.contextMenuVisible = false
      this.deleteFileShow = false
    },
    //初始化
    initPage() {
      this.lastId = this.$route.params.id
      this.breadcrumb = window.localStorage.getItem('breadLabel').split(">")
      //路由id改变且获取到新路径后,读取文件
      this.load_markdownFile()
    },
    //创建大纲
    createOutLine() {
      setTimeout(() => {
        if (this.titleHtml !== $(".vditor-outline__content").html()) {
          this.titleHtml = $(".vditor-outline__content").html()
          this.$store.commit('setOutline', this.sendTitles())
        }
      }, 500)
    },
    sendTitles() {
      let data = [];
      let id = 1;
      $(".vditor-outline__content > ul > li").each(function () {
        //一级标题
        const newChild = {id: id++, label: $(this).children('span').text(), children: [], level: 1};
        data.push(newChild)

        if ($(this).children('ul').length > 0) {
          $(this).children('ul').children('li').each(function () {
            //二级标题
            const newChild2 = {id: id++, label: $(this).children('span').text(), children: [], level: 2};
            newChild.children.push(newChild2)

            if ($(this).children('ul').length > 0) {
              $(this).children('ul').children('li').each(function () {
                //三级标题
                const newChild3 = {id: id++, label: $(this).children('span').text(), children: [], level: 3};
                newChild2.children.push(newChild3)

                if ($(this).children('ul').length > 0) {
                  $(this).children('ul').children('li').each(function () {
                    //四级标题
                    const newChild4 = {id: id++, label: $(this).children('span').text(), children: [], level: 4};
                    newChild3.children.push(newChild4)
                  })
                }
              })
            }
          })
        }
      })
      return data
    },
    update_markdownFile() {
      this.$db.putContent(this.lastId, this.contentEditor.getValue())
    },
    load_markdownFile() {
      this.$db.getContent(this.$route.params.id, result => {
        this.contentEditor.setValue(result)
      })
    }
  }
}
</script>
<style>
ul li {

  list-style: none;

}

.el-breadcrumb {
  height: 28px;
  font-size: 16px;
  padding-top: 6px;
  padding-left: 20px;
}
</style>
