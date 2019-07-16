<template>
  <div class="categories">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button class="diy" @click="isShowAdd">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="tableData"  style="width: 100%" row-key="cat_id">
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot:default="{ row }">
          {{ row.cat_deleted ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button type="primary" size="small" circle plain icon="el-icon-edit" @click="showEdit(row)"></el-button>
          <el-button type="danger" size="small" circle plain icon="el-icon-delete" @click="delCategory(row, $event)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 修改框 -->
    <!-- 表单校验必须要有prop指定 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="isShowEdit"
      width="40%">
      <el-form :model="editList" label-width="80px" ref="editList">
        <el-form-item label="分类名称" prop="cat_name" :rules="[
          { required: true, message: '请输入分类名称', trigger: 'blur'}
        ]">
          <el-input v-model="editList.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowEdit = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="isShowDialog"
      width="45%">
      <el-form :model="addData" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="addData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            v-model="addData.id"
            :options="addList"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      isShowEdit: false,
      editList: {
        cat_name: '',
        id: ''
      },
      isShowDialog: false,
      addData: {},
      addList: []
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getCategoriesList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCategoriesList()
    },
    async getCategoriesList () {
      const { meta, data } = await this.axios.get('categories', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.tableData = data.result
        this.total = data.total
      }
    },
    async delCategory (row, e) {
      try {
        await this.$confirm('你确定要删除该分类吗?', '温馨提示', {
          type: 'waring'
        })
        const { meta } = await this.axios.delete(`categories/${row.cat_id}`)
        if (meta.status === 200) {
          if (this.tableData.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.$message.success(meta.msg)
          this.getCategoriesList()
        }
      } catch {
        let current = e.target
        if (e.target.nodeName === 'I') {
          current = e.target.parentNode
        }
        current.blur()
        this.$message('已撤销删除')
      }
    },
    showEdit (row) {
      this.isShowEdit = true
      this.editList.cat_name = row.cat_name
      this.editList.id = row.cat_id
    },
    async editCategory () {
      const { meta } = await this.axios.put(`categories/${this.editList.id}`, this.editList)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.$refs.editList.resetFields()
        this.isShowEdit = false
        this.getCategoriesList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    isShowAdd () {
      this.isShowDialog = true
    },
    handleChange (value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss">
.categories {
  height: 100%;
  .diy {
    margin: 10px 0;
    background: url('../../assets/325473.jpg') no-repeat center center/cover;
    color: transparent;
    font-size: 40px;
    opacity: .6;
    &:active,
    &:focus,
    &:hover {
      color: transparent;
    }
  }
  .el-table,
  .el-table th,
  .el-table tr {
    background-color: black;
    opacity: .7;
    color: white;
  }
  .el-pagination {
    background-color: black;
    opacity: .6;
  }
  .el-table__row:hover {
    color: black;
  }
}
</style>
