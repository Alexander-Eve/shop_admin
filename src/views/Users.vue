<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div style="margin: 15px 0;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <template>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          label="用户状态">
          <template v-slot:default="{ row }">
            <el-switch
              v-model="row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              value="row.id"
              @change='change(row)'>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot:default="{ row }">
            <el-button size='mini' type="primary" icon="el-icon-edit" circle></el-button>
            <el-button size='mini' @click="del(row.id)" type="danger" icon="el-icon-delete" circle></el-button>
            <el-button size='mini' type="success" icon="el-icon-check" round>分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">

    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0
    }
  },
  created () {
    this.getQueryList()
  },
  methods: {
    getQueryList () {
      this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        console.log(res)
        const { meta, data } = res
        if (meta.status === 200) {
          this.tableData = data.users
          this.total = data.total
        }
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getQueryList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getQueryList()
    },
    search () {
      this.getQueryList()
    },
    change (state) {
      this.axios.put(`users/${state.id}/state/${state.mg_state}`).then(res => {
        const { data } = res
        if (data.mg_state) return this.$message.success('启用成功')
        this.$message.error('禁用成功')
      })
    },
    del (id) {
      this.axios.delete(`users/${id}`).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('成功删除该用户')
          if (this.tableData.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getQueryList()
        }
      }).carch(res => {
        this.$message.error('删除失败')
      })
    }
  }
}
</script>

<style lang="scss">
.users {
  height: 100%;
  background: url('../assets/292492.jpg') no-repeat center center/cover;
  .el-pagination {
    background-color: #fff;
  }
  .el-breadcrumb {
    line-height: 40px;
    background-color: #fff;
    padding-left: 10px;
  }
  .input-with-select {
    width: 400px;
    margin-right: 30px;
  }
}

</style>
