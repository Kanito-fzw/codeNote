<template>
  <div class="block">
    <el-tree
        :data="data"
        node-key="id"
        draggable
        @node-click="noteClick"
        :allow-drop="allowDrop"
        default-expand-all>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <v-icon v-if="!data.icon">
        {{ node.expanded ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else>
        {{ data.icon }}
      </v-icon>  {{ node.label }}</span>
        <span >
          <el-button
              v-if="!data.icon"
              type="text"
              size="mini"
              @click.stop="() => appendFile(data)">
            <v-icon>
              {{'mdi-file-plus-outline'}}
            </v-icon>
          </el-button>
          <el-button
              v-if="!data.icon"
              type="text"
              size="mini"
              @click.stop="() => append(data)">
            <v-icon>
              {{'mdi-folder-plus'}}
            </v-icon>
          </el-button>
          <el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)">
            <v-icon>
              {{'mdi-delete'}}
            </v-icon>
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
let id = 1000;

export default {
  data() {
    return {
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1',
              icon: 'mdi-file-document-outline',
            }, {
              id: 10,
              label: '三级 1-1-2',
              icon: 'mdi-file-document-outline',
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1',
            icon: 'mdi-file-document-outline',
          }, {
            id: 6,
            label: '二级 2-2',
            icon: 'mdi-file-document-outline',
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1',
            icon: 'mdi-file-document-outline',
          }, {
            id: 8,
            label: '二级 3-2',
            icon: 'mdi-file-document-outline',
          }]
        }
      ]
    }
  },

  methods: {
    noteClick(data, node, obj){
      console.log(data)
      if (data.icon){

      }

    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.icon&&type=='inner'){
        return false
      }else {
        return true
      }
    },
    append(data) {
      const newChild = {id: id++, label: 'folder', children: []};
      if (!data.children && !data.icon) {
        this.$set(data, 'children', []);
      }
      if (data.icon){

      }else {

        data.children.push(newChild);
      }
    },
    appendFile(data) {
      const newChild = {id: id++, label: 'file', icon: 'mdi-file-document-outline'};
      if (!data.children && !data.icon) {
        this.$set(data, 'children', []);
      }
      if (data.icon){

      }else {

        data.children.push(newChild);
      }
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    renderContent(h, {node, data, store}) {
      return (
          <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
          <el-button size="mini" type="text" on-click={() => this.append(data)}>Append</el-button>
      <el-button size="mini" type="text" on-click={() => this.remove(node, data)}>Delete</el-button>
      </span>
      </span>);
    }
  }
};
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
