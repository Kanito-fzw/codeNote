<template>
<div ref="fileIndex">
  <el-tree
      :data="data"
      :props="defaultProps"
      :default-expand-all="true"
      :render-content="renderContent"
      :highlight-current="false"
    ></el-tree>
</div>
</template>

<script>
export default {

  data() {
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  mounted() {
    this.getTitles()
  },
  computed: {
    listenshowpage1() {
      return this.$store.getters.outline;
    }
  },
  watch:{
    listenshowpage1:function(newVal, oldVal){
      this.data=newVal
    }
  },
  methods:{
    //修改字体
    renderContent(h, { node, data, store }) {
      if (data.level === 1) {
        return <span style="font-size:18px">{node.label}</span>;
      } else if(data.level ===2){
        return <span style="font-size:16px">{node.label}</span>;
      }else if(data.level ===3){
        return <span style="font-size:14px">{node.label}</span>;
      }else{
        return <span style="font-size:6px;color:grey">{node.label}</span>;
      }
    },

    getTitles(){
        this.data=this.$store.getters.outline
    }
  }
}
</script>

<style scoped>

</style>
