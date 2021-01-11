<template>
  <div>
    <mavon-editor
        :codeStyle="codeStyle"
        :ishljs="ishljs"
        v-model="content"
        :placeholder="'Edit ···'"
        ref="md"
        @change="change"
        @imgAdd="imgAdd"
        @imgDel="imgDel"
        :toolbars="toolbars"
        :toolbarsBackground="'#f9f9f9'"
    />
  </div>
</template>
<script>
import $ from 'jquery'
import '@/assets/css/button.css'
import { addCodeBtn } from '@/assets/js/button'
import 'mavon-editor/dist/markdown/github-markdown.min.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/idea.css' // 样式文件
hljs.highlightCode = function () {
  //自定义highlightCode方法，将只执行一次的逻辑去掉
  let blocks = document.querySelectorAll('pre code');
  [].forEach.call(blocks, hljs.highlightBlock);
};

export default {
  created() {
  },
  mounted(){
    this.codeBlock()
  },
  data() {
    return {
      language:[],
      defaultLanguage:'',
      ishljs:false,
      codeStyle:'idea',//设置主题 ，
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        save: true, // 保存（触发events中的save事件）
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      content: "#### how to use mavonEditor in nuxt.js\n" +
          "```java\n" +
          "public static void main(String[] args){\n" +
          "\tlog.info(\"eee\");\n" +
          "}\n" +
          "```"
    }

  },
  methods: {
    change(){
      this.codeBlock()
    },
    codeBlock(){
      this.$nextTick(_ => {
        addCodeBtn()
        hljs.highlightCode()
      })
    },
    imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('image', $file)
      this.img_file[pos] = $file
      this.$http({
        url: '/api/edit/uploadimg',
        method: 'post',
        data: formdata,
        headers: {'Content-Type': 'multipart/form-data'}
      }).then((res) => {
        let _res = res.data
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        this.$refs.md.$img2Url(pos, _res.url)
      })
    },
    imgDel(pos) {
      delete this.img_file[pos]
    },
    // 提交
    submit() {
      console.log(this.content)
      console.log(this.html)
    }
  }
}
</script>

<style scoped>
.v-note-wrapper{ z-index:1 !important; }

</style>
