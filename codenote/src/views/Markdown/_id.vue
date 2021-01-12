<template>
  <div className="order">
    <br>
    <br>

    <div id="vditor"></div>
    <button @click="loginfo">log</button>
  </div>
</template>
<script>
import Vditor from "vditor"
import "vditor/dist/index.css"

export default {
  data() {
    return {
      contentEditor: ""
    }
  },
  mounted() {
    this.contentEditor = new Vditor("vditor", {
      minHeight: 500,
      tab: '\t',
      mode: 'ir',
      preview: {
        theme: {current: 'light'},
        hljs: {
          enable: true,
          style: 'vs'

        }
      },
      toolbarConfig: {
        pin: true
      },
      cache: {
        enable: false
      },
      after: () => {
        this.contentEditor.setValue("hello,Vditor+Vue!")
      }
    })
  },
  methods: {
    loginfo() {
      console.log(this.contentEditor.getValue())
    }
  }
}
</script>
