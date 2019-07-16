<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div style="margin: 15px 0;" class="search">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" @click="isShow = true">添加用户</el-button>
    </div>

    <!-- 表格 -->
    <template>
      <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column label="用户状态">
          <template v-slot:default="{ row }">
            <el-switch v-model="row.mg_state" active-color="#13ce66" inactive-color="#ff4949" value="row.id" @change='change(row)'>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot:default="{ row }">
            <el-button size='mini' type="primary" icon="el-icon-edit" circle @click="edit(row)"></el-button>
            <el-button size='mini' @click="delUsers(row.id,$event)" type="danger" icon="el-icon-delete" circle></el-button>
            <el-button size='mini' type="success" icon="el-icon-check" round @click="distribute(row)">分配角色</el-button>
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

    <!-- 修改框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-tag type="info">{{ form.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email" >
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile" >
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editing">确 定</el-button>
      </div>
    </el-dialog>
      <!-- 添加框 -->
    <el-dialog title="添加用户" :visible.sync="isShow" width="40%">
      <el-form :model="addForm" ref="addForm" :rules="rules">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="addInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="isCategory">
      <el-form :model="assignForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-tag type="info">{{ assignForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表" :label-width="formLabelWidth">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in heroForm"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isCategory = false">取 消</el-button>
        <el-button type="primary" @click="assignRight">确 定</el-button>
      </div>
    </el-dialog>

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
      total: 0,
      dialogFormVisible: false,
      isShow: false,
      form: {},
      formLabelWidth: '80px',
      isCategory: false,
      addForm: {},
      heroForm: [],
      assignForm: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getQueryList()
  },
  methods: {
    async getQueryList () {
      const { meta, data } = await this.axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.tableData = data.users
        this.total = data.total
      }
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
    async change ({ id, mg_state: state }) {
      const { data } = await this.axios.put(`users/${id}/state/${state}`)
      if (data.mg_state) return this.$message.success('启用成功')
      this.$message.error('禁用成功')
    },
    async delUsers (id, e) {
      try {
        await this.$confirm('是否确认删除该用户', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('成功删除该用户')
          if (this.tableData.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getQueryList()
        }
      } catch {
        let current = e.target
        if (e.target.nodeName === 'I') {
          current = e.target.parentNode
        }
        current.blur()
        this.$message('删除失败')
      }
    },
    async addInfo () {
      try {
        await this.$refs.addForm.validate()
        const { meta } = await this.axios.post('users', this.addForm)
        if (meta.status === 201) {
          // 重新渲染页面
          this.getQueryList()
          // 提示成功
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
        // 隐藏对话框
        this.isShow = false
        // 清空列表
        this.$refs.addForm.resetFields()
      } catch (e) {
        return false
      }
    },
    edit (user) {
      // 显示对话框
      this.dialogFormVisible = true
      //  把数据给form 实现数据回显
      this.form = { ...user }
    },
    async editing () {
      const { id, email, mobile } = this.form
      await this.$refs.form.validate()
      await this.axios.put(`users/${id}`, { email, mobile })
      // 隐藏对话框
      this.dialogFormVisible = false
      // 提示框
      this.$message.success('更新成功')
      // 重新渲染
      this.getQueryList()
    },
    async distribute (row) {
      this.isCategory = true
      // 回显用户名名和id
      this.assignForm.username = row.username
      this.assignForm.id = row.id
      // 发送ajax获取下拉框的数据回显
      const { meta, data } = await this.axios.get(`roles`)
      if (meta.status === 200) {
        this.heroForm = data
      }
      //  通过ajax让下拉框的数据获取rid
      const res = await this.axios.get(`users/${row.id}`)
      console.log(res)
      this.assignForm.rid = res.data.rid === -1 ? '' : res.data.rid
    },
    async assignRight () {
      if (!this.assignForm.rid) {
        return this.$message.error('请选择角色')
      }
      const { meta } = await this.axios.put(`users/${this.assignForm.id}/role`, this.assignForm)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.isCategory = false
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss">
.users {
  height: 100%;
  background:black url('../../assets/303536.jpg') no-repeat center center/cover;
  .el-pagination {
    background-color: black;
    opacity: .6;
  }
  .input-with-select {
    width: 400px;
    margin-right: 30px;
  }
  .el-table,
  .el-table tr,
  .el-table th {
    background-color: black;
    opacity: .6;
  }
  .search {
    background-color: black;
    opacity: .5;
  }
}

</style>
