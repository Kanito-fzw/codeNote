<template>
  <div class="order">
hello world
    <button @click="nock">button</button>
  </div>
</template>
<script>
const ipcRenderer =window.require('electron').ipcRenderer
console.log(ipcRenderer)


export default {
methods:{
  nock(){
    // 这里是接收主进程传递过来的参数，这里的on要对应主进程send过来的名字
    ipcRenderer.on("asynchronous-reply", function(event, arg) {
// 这里的arg是从主线程请求的数据
      console.log("render+" + arg);
    });

// 这里的会传递回给主进程，这里的第一个参数需要对应着主进程里on注册事件的名字一致
    ipcRenderer.send("asynchronous-message", "传递回去ping");
  }
}
}
</script>
