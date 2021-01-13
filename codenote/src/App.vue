<template>
  <div id="app">
    <Layout></Layout>
  </div>
</template>

<script>
import Layout from "@/components/Layout";
export default {
  name: 'app',
  components: {
    Layout
  }
}
</script>

<style>
html {
  /* 禁用html的滚动条，因为用的无框架窗口，默认就会有一个滚动条，所以去掉 */
  overflow-y: hidden;
}
</style>
