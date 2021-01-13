<!--<template>-->
<!--  <div class="order">-->
<!--    hello world-->
<!--    <br>-->
<!--    <button @click="create_markdownIndex">create_markdownIndex</button>-->
<!--    <br>-->
<!--    <button @click="save_markdownFile">save_markdownFile</button>-->
<!--    <br>-->
<!--    <button @click="load_markdownFile">load_markdownFile</button>-->
<!--    <br>-->

<!--  </div>-->
<!--</template>-->
<!--<script>-->
<!--const ipcRenderer = window.require('electron').ipcRenderer-->
<!--console.log(ipcRenderer)-->
<!--const index = 'home>aaaccc>dddd>ddd'-->
<!--const file = 'home>aaaccc>dddd>ddd'-->
<!--const content = '# 标题'-->

<!--export default {-->
<!--  methods: {-->
<!--    create_markdownIndex() {-->
<!--      ipcRenderer.on("create-markdownIndex-reply", function (event, arg) {-->
<!--        console.log("render+" + arg);-->
<!--      });-->
<!--      ipcRenderer.send("create-markdownIndex-message", index.replace(/>/g, '/'));-->
<!--    },-->
<!--    save_markdownFile() {-->
<!--      ipcRenderer.on("save-markdownFile-reply", function (event, arg) {-->
<!--        console.log("render+" + arg);-->
<!--      });-->
<!--      ipcRenderer.send("save-markdownFile-message", file.replace(/>/g, '/') + '.md', content);-->
<!--    },-->
<!--    load_markdownFile() {-->
<!--      ipcRenderer.on("load-markdownFile-reply", function (event, arg) {-->
<!--        console.log("render+" + arg);-->
<!--      });-->
<!--      ipcRenderer.send("load-markdownFile-message", file.replace(/>/g, '/') + '.md');-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
