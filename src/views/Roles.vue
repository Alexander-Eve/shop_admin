<template>
  <div class="">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/#">角色列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="roleData" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button type="primary" icon="el-icon-edit"  plain circle size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain circle size="small"></el-button>
          <el-button type="success" icon="el-icon-check" plain round size="small">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleData: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { meta, data } = await this.axios.get('roles')
      if (meta.status === 200) {
        this.roleData = data
      }
    }
  }
}
</script>

<style lang="scss">
</style>
