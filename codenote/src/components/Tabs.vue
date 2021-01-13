<template>
  <el-col :span="24" v-show="tabsShowFlag">
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
      tabIndex: 1,
      tabsShowFlag: false
    }
  },
  watch: {
    tabsItem(val) {
      if (val.length === 0) {
        if (window.timeTrigger) {
          clearInterval(window.timeTrigger)
          window.timeTrigger = null
        }
        this.tabsShowFlag = false
        this.$router.push({
          path: '/About'
        })
      } else {
        this.tabsShowFlag = true
      }
    }
  },
  mounted() {
    bus.$on('add', (name, val) => {
      this.addTab(name, val)
    })
    bus.$on('delete', (val) => {
      this.removeTab(val.toString())
    })
    bus.$on('reName', (id, newName) => {
      this.reNameTab(id, newName)
    })
  },
  methods: {
    addTab(name, val) {//增加tab
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
          id: val,
        })
        this.activeTab = val.toString()
      }
    },
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
    reNameTab(id, newName) { //重命名Tab
      let tabs = this.tabsItem //当前显示的tab数组
      tabs.forEach((tab) => {
        if (tab.id === id) {
          tab.title = newName
        }
      })
    },
    tabClick(thisTab) {
      /*
      * thisTab:当前选中的tabs的实例
      * 通过当前选中tabs的实例获得当前实例的path 重新定位路由
      * */
      try {
        this.tabsItem.forEach((item) => {
          if (item.name === thisTab.name) {
            if (item.id != this.$route.path.substr(10)) {
              bus.$emit('focus', item.id)
              this.$router.push({
                path: '/Markdown/' + item.id+'?a='+item.title
              })
            }
            throw new Error("breakForEach");
          }
        })
      } catch (e) {
        if (e.message != "breakForEach") throw e;
      }

    }
  }
}
</script>
