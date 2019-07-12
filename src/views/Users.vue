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
      <el-button type="success" @click="isShow = true">添加用户</el-button>
    </div>
     <!-- 添加框 -->
      <el-dialog title="添加用户" :visible.sync="isShow">
        <el-form :model="addForm" ref="addForm">
          <el-form-item prop="username" label="用户名" :label-width="formLabelWidth" :rules="[
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ]">
            <el-input type="text" v-model="addForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码" :label-width="formLabelWidth" :rules="[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ]">
            <el-input type="password" v-model="addForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth" :rules="[
            { message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]">
            <el-input type="email" v-model="addForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="mobile" label="手机" :label-width="formLabelWidth" :rules="[
            { message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '手机号格式错误', trigger: ['blur'] }
          ]">
            <el-input type="mobile" v-model="addForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShow = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
        </div>
      </el-dialog>

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
            <el-button size='mini' type="primary" icon="el-icon-edit" circle @click="edit(row.id)"></el-button>
            <el-button size='mini' @click="del(row.id)" type="danger" icon="el-icon-delete" circle></el-button>
            <el-button size='mini' type="success" icon="el-icon-check" round>分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改框 -->
      <el-dialog title="编辑用户" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <template>
              <span class="el-value">{{ form.username }}</span>
            </template>
          </el-form-item>
          <el-form-item
          prop="email"
          label="邮箱"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]">
            <el-input type="email" v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
          prop="mobile"
          label="手机"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '手机号格式错误', trigger: ['blur'] }
          ]">
            <el-input type="mobile" v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editing(form)">确 定</el-button>
        </div>
      </el-dialog>

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
      total: 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      isShow: false,
      form: {},
      formLabelWidth: '120px',
      addForm: {}
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
      }).catch(res => {
        this.$message.error('删除失败')
      })
    },
    edit (id) {
      this.dialogFormVisible = true
      console.log(id)
      this.axios.get(`users/${id}`).then(res => {
        console.log(res)
        const { data } = res
        this.form = data
      })
    },
    editing (form) {
      this.dialogFormVisible = false
      this.axios.put(`users/${form.id}`, form).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.getQueryList()
          this.$message.success('更新成功')
        }
      })
    },
    submitForm (addForm) {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          console.log(this.addForm)
          this.axios.post('users', this.addForm).then(res => {
            console.log(res)
            const { meta } = res
            if (meta.status === 201) {
              this.getQueryList()
              this.$message.success(meta.msg)
              this.isShow = false
              this.$refs.addForm.resetFields()
            }
          })
        } else {
          this.$message.error('请输入正确的格式')
          this.$refs.addForm.resetFields()
          return false
        }
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
  .el-value {
    background-color: rgba(144,147,153,.1);
    border-color: rgba(144,147,153,.2);
    padding: 0 10px;
    display: inline-block;
    height: 32px;
    line-height: 30px;
    font-size: 12px;
    border-radius: 4px;
    border: 1px solid rgba(64,158,255,.2);
    color: #909399;
  }
}

</style>
