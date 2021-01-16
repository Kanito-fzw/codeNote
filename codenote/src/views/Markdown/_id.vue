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
      <el-dropdown-item id="rightCilck_copy">复制</el-dropdown-item>
      <el-dropdown-item id="rightCilck_paste">粘贴</el-dropdown-item>
      <el-dropdown-item id="rightCilck_cut">剪切</el-dropdown-item>
      <el-dropdown-item id="rightCilck_codeBock">插入代码块</el-dropdown-item>
      <el-dropdown-item id="rightCilck_showBoor" v-show="!showBoorFlag">显示工具栏</el-dropdown-item>
      <el-dropdown-item id="rightCilck_hiddenBoor" v-show="showBoorFlag">隐藏工具栏</el-dropdown-item>
    </div>
  </div>
</template>
<script>
import Vditor from "vditor"
import "vditor/dist/index.css"
import VditorPreview from 'vditor/dist/method.min'
const clipboard  = window.require('electron').clipboard
VditorPreview.mermaidRender(document)
import $ from 'jquery'

export default {
  data() {
    return {
      showBoorFlag:true,//显示工具栏
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
        document.body.addEventListener('mousedown', this.closRightMenu)
        document.getElementById('rightCilck_copy').addEventListener('mousedown', this.rightCilck_copy)
        document.getElementById('rightCilck_paste').addEventListener('mousedown', this.rightCilck_paste)
        document.getElementById('rightCilck_cut').addEventListener('mousedown', this.rightCilck_cut)
        document.getElementById('rightCilck_codeBock').addEventListener('mousedown', this.rightCilck_codeBock)
        document.getElementById('rightCilck_showBoor').addEventListener('mousedown', this.rightCilck_showBoor)
        document.getElementById('rightCilck_hiddenBoor').addEventListener('mousedown', this.rightCilck_hiddenBoor)
      } else {
        document.body.removeEventListener('mousedown', this.closRightMenu)
      }
    }
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
        "list",
        "ordered-list",
        "check",
        "quote",
        "line",
        "table",
        "code",
        "inline-code",
        "fullscreen",
        "export",
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
    rightCilck_copy(event){
      event.preventDefault();
      this.closRightMenu()
      clipboard.writeText(this.contentEditor.getSelection())
    },
    rightCilck_paste(event){
      event.preventDefault();
      this.closRightMenu()
      console.log(clipboard.readText())
      this.contentEditor.insertValue(clipboard.readText(),true)
    },
    rightCilck_cut(event){
      event.preventDefault();
      this.closRightMenu()
      console.log(clipboard.readText())
      clipboard.writeText(this.contentEditor.getSelection())
      this.contentEditor.deleteValue()
    },
    // 右键功能-插入代码库
    rightCilck_codeBock(event){
      event.preventDefault();
      this.closRightMenu()
      this.contentEditor.insertValue('\n```',true)
    },
    // 右键功能-显示工具栏
    rightCilck_showBoor(event){
      event.preventDefault();
      this.closRightMenu()
      document.getElementsByClassName('vditor-toolbar')[0].style.display='block'
      this.showBoorFlag=true
    },
    rightCilck_hiddenBoor(event){
      event.preventDefault();
      this.closRightMenu()
      document.getElementsByClassName('vditor-toolbar')[0].style.display='none'
      this.showBoorFlag=false
    },
    //右键事件
    rightClick(event) {
      if ('translateX(0%)'==document.getElementById('leftWrapper').style.transform){
        this.x = event.clientX-parseInt(document.getElementById('leftWrapper').style.width)
      }
      else {
        this.x = event.clientX
      }
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
