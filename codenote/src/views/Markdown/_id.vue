<template>
  <div className="order">
    <el-breadcrumb style="height: 28px;font-size: 16px;margin-top: 10px;margin-left: 10px;display: inline">
      <el-breadcrumb-item v-for="item in breadcrumb">{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div id="vditor"></div>
    <button @click="save_markdownFile">saveMd</button>
    <button @click="load_markdownFile">loadMd</button>
  </div>
</template>
<script>
import Vditor from "vditor"
import "vditor/dist/index.css"
import VditorPreview from 'vditor/dist/method.min'

const ipcRenderer = window.require('electron').ipcRenderer
console.log(ipcRenderer)
const index = 'home>aaaccc>dddd>ddd'
const file = 'home>aaaccc>dddd>ddd'
const content = '# 标题'

VditorPreview.mermaidRender(document)
import $ from 'jquery'

export default {
  data() {
    return {
      titleHtml: '',//大纲
      contentEditor: "",//vditor插件
      breadcrumb: [],//面包屑
      savePath:'',//保存路径
      testMd:'',
    }
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route(to) {
      this.timeSetter()
      this.contentEditor.setValue(to.params.id + '\n' + to.query.a)
      if (to.params.id) {
        this.$nextTick(() => {
          this.breadcrumb = window.localStorage.getItem('breadLabel').split(">")
          this.savePath = window.localStorage.getItem('breadLabel').replace(/>/g,'/')
        })
      }
    },

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
        "emoji",
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
      after: () => {
        this.contentEditor.setValue("hello,Vditor+Vue!\n" +
            "\n" +
            "# 标题1\n" +
            "\n" +
            "## 副标题\n" +
            "\n" +
            "### 子标题a\n" +
            "\n" +
            "### 子标题b\n" +
            "\n" +
            "\n" +
            "# 标题2\n" +
            "\n" +
            "# 标题3\n" + this.$route.params.id)
      }
    })
    //注册到全局
    window.vditor = this.contentEditor
    this.timeSetter()
    //窗口自适应
    window.onresize = function () {
      document.getElementById('vditor').style.height = document.body.clientHeight - 147 + 'px'
    }
  },
  methods: {
    heightPut() {
      console.log(document.body.clientHeight)
    },
    stopTrigger() {
      if (window.timeTrigger) {
        clearInterval(window.timeTrigger)
        window.timeTrigger = null
      }
    },
    timeSetter() {
      this.$nextTick(() => {
        if (window.timeTrigger) {
          clearInterval(window.timeTrigger)
          window.timeTrigger = null
        }
        window.timeTrigger = setInterval(() => {
          if (this.titleHtml !== $(".vditor-outline__content").html()) {
            this.titleHtml = $(".vditor-outline__content").html()
            this.$store.commit('setOutline', this.sendTitles())
          }
        }, 1000)
      })
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
    create_markdownIndex() {
      ipcRenderer.on("create-markdownIndex-reply", function (event, arg) {
        console.log("render+" + arg);
      });
      ipcRenderer.send("create-markdownIndex-message", index.replace(/>/g, '/'));
    },
    save_markdownFile() {
      ipcRenderer.on("save-markdownFile-reply", function (event, arg) {
        console.log("render+" + arg);
      });
      ipcRenderer.send("save-markdownFile-message", this.savePath + '.md', this.contentEditor.getValue());
    },
    load_markdownFile() {
        ipcRenderer.on("load-markdownFile-reply",  (event, arg)=> {
            this.contentEditor.setValue(arg)
        });
        ipcRenderer.send("load-markdownFile-message", this.savePath + '.md');

    }
  }
}
</script>
<style>
ul li {

  list-style: none;

}
</style>
