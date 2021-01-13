<template>
  <div className="order">
    <br>
    <br>
    <div id="vditor"></div>
  </div>
</template>
<script>
import Vditor from "vditor"
import "vditor/dist/index.css"
import VditorPreview from 'vditor/dist/method.min'

VditorPreview.mermaidRender(document)
import $ from 'jquery'

export default {
  data() {
    return {
      titleHtml: '',
      contentEditor: ""
    }
  },
  // 监听,当路由发生变化的时候执行
  watch: {
    $route(to) {
      this.timeSetter()
      this.contentEditor.setValue(this.contentEditor.getValue() + to.params.id)
    },

  },
  mounted() {
    this.contentEditor = new Vditor("vditor", {
      minHeight: 500,
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
            "# 标题3")
      }
    })
    window.vditor = this.contentEditor
    this.timeSetter()
  },
  methods: {
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
    }
  }
}
</script>
<style>
ul li {

  list-style: none;

}
</style>
