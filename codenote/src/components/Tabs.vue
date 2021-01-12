<template>
  <el-col :span="24">
    <el-tabs v-model="activeTab" ref="tabs" type="card" closable :stretch="true" @tab-remove="removeTab"
             @tab-click="tabClick">
      <el-tab-pane
          v-for="(item, index) in tabsItem"
          :key="item.id"
          :label="item.title"
          :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

  </el-col>
</template>
<script>
import bus from '@/assets/js/bus';

export default {
  data() {
    return {
      activeTab: '', //默认显示的tab
      tabsItem: [],
      tabIndex: 1
    }
  },
  watch:{
    tabsItem(val){
      if (val.length===0){
        if (window.timeTrigger){
          clearInterval(window.timeTrigger)
          window.timeTrigger=null
        }
        this.$router.push({
          path: '/About'
        })
      }
    }
  },
  mounted() {
    bus.$on('add', (name, val) => {//处理传过来的值
      let flag = true
      this.tabsItem.forEach((item) => {
        if (item.id === val) {
          this.activeTab = item.name
          flag = false
        }
      })
      if (flag) {
        this.tabsItem.push({
          title: name,
          name: val.toString(),
          id: val
        })
        this.activeTab = val.toString()
      }
    })
    bus.$on('delete', ( val) => {
      this.removeTab(val.toString())
    })
  },
  methods: {
    removeTab(targetName) { //删除Tab
      let tabs = this.tabsItem //当前显示的tab数组
      let activeName = this.activeTab //点前活跃的tab

      //如果当前tab正活跃 被删除时执行
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              this.tabClick(nextTab)
            }
          }
        });
      }
      this.activeTab = activeName
      this.tabsItem = tabs.filter(tab => tab.name !== targetName)
    },
    tabClick(thisTab) {
      /*
      * thisTab:当前选中的tabs的实例
      * 通过当前选中tabs的实例获得当前实例的path 重新定位路由
      * */

      this.tabsItem.forEach((item) => {
        if (item.name === thisTab.name) {
          if (item.id != this.$route.path.substr(10)) {
            bus.$emit('focus',item.name)
            this.$router.push({
              path: '/Markdown/' + item.id
            })
          }
        }
      })
    }
  }
}
</script>
