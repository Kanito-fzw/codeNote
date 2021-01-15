<template>
  <div className="order">
    <el-breadcrumb style="height: 28px;font-size: 16px;padding-top: 6px">
      <el-breadcrumb-item v-for="item in breadcrumb">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div id="vditor"></div>
    <button @click="update_markdownFile">saveMd</button>
    <button @click="load_markdownFile">loadMd</button>
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
      titleHtml: '',//大纲
      contentEditor: "",//vditor插件
      breadcrumb: [],//面包屑
      lastId: ''
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
          if (this.lastId===''){
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
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "table",
        "code",
        "inline-code",
        "|",
        "fullscreen",
        "edit-mode",
        "both",
        "code-theme",
        "content-theme",
        "export",
        "preview",
        "info",
        "help",
      ],
      toolbarConfig: {
        pin: true
      },
      cache: {
        enable: false
      },
      after:() =>{//编辑器渲染完成后填充内容
        this.initPage()
      },
      input:()=> {//编辑内容后实时保存并生成大纲
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
      },500)
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
      this.$db.putContent(this.lastId,this.contentEditor.getValue())
    },
    load_markdownFile() {
      this.$db.getContent(this.$route.params.id,result=>{
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
</style>
