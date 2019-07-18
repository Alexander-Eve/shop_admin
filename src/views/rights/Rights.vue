<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/#">权限列表</a></el-breadcrumb-item>
    </el-breadcrumb>
      <!-- 表格 -->
    <el-table :data="rightData" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template v-slot:default="{ row }">
          <span v-if= "+row.level === 0">一级</span>
          <span v-else-if= "+row.level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightData: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      const { data } = await this.axios.get('rights/list')
      this.rightData = data
    }
  }
}
</script>

<style lang="scss">
.rights {
  height: 100%;
  .el-breadcrumb {
    color: white;
  }
}
</style>
