<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/#">角色列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="roleData" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default= "{ row }">
          <span v-show="!row.children.length">角色好像弄丢了哟</span>
          <el-row v-for="l1 in row.children" :key="l1.id" class="bottom">
            <el-col :span="4">
              <el-tag closable @close="close(row,l1.id)">{{ l1.authName }}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag closable type="success" @close="close(row,l2.id)">{{ l2.authName }}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag v-for="l3 in l2.children" :key="l3.id" closable type="warning" @close="close(row,l3.id)"> {{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

        </template>
      </el-table-column>
      <el-table-column type="index" ></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button type="primary" icon="el-icon-edit"  plain circle size="small" @click="editRight(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain circle size="small" @click="delRight(row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain round size="small" @click="assignRight(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="edit" @click="addShow = true">添加角色</el-button>
    <!-- 分配框 -->
    <el-dialog
      title="角色授权"
      :visible.sync="roleDialog"
      width="45%">
      <el-tree
        :data="empower"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        node-key="id"
        ref='tree'
        ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="cofirmation()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="isEditing"
      width="40%">
      <el-form label-width="80px" :model= "editData" ref="editData">
        <el-form-item label="角色名称" prop="roleName" :rules="[
          { required: true, message: '请输入角色名', trigger: 'blur'}
        ]">
          <el-input v-model="editData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editData.roleDesc" @keyup.enter.native="define"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditing = false">取 消</el-button>
        <el-button type="primary" @click="define">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addShow"
      width="40%">
      <el-form label-width="80px" :model= "addData" ref="addData">
        <el-form-item label="角色名称" prop="roleName" :rules="[
          { required: true, message: '请输入角色名', trigger: 'blur'}
        ]">
          <el-input v-model="addData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addShow = false">取 消</el-button>
        <el-button type="primary" @click="addRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleData: [],
      roleDialog: false,
      empower: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      isEditing: false,
      editData: {
        roleDesc: '',
        roleName: '',
        id: ''
      },
      addData: {
        roleName: '',
        roleDesc: ''
      },
      addShow: false
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
        console.log(data)
      }
    },
    async assignRight (row) {
      this.roleDialog = true
      this.roleId = row.id
      const { meta, data } = await this.axios.get('rights/tree')
      if (meta.status === 200) {
        this.empower = data
      }
      let ids = []
      row.children.forEach(v => {
        v.children.forEach(v => {
          v.children.forEach(v => {
            ids.push(v.id)
          })
        })
      })
      this.$refs.tree.setCheckedKeys(ids)
    },
    async cofirmation () {
      let ids = this.$refs.tree.getCheckedKeys()
      let halfIds = this.$refs.tree.getHalfCheckedKeys()
      let rids = [ ...ids, ...halfIds ].join()
      const { meta } = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        // 隐藏对话框
        this.roleDialog = false
        // 重新渲染
        this.getRolesList()
      }
    },
    async close (row, id) {
      const { meta, data } = await this.axios.delete(`roles/${row.id}/rights/${id}`)
      if (meta.status === 200) {
        row.children = data
        this.$message.success(meta.msg)
      }
    },
    async delRight (id) {
      const { meta } = await this.axios.delete(`roles/${id}`)
      console.log(meta)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getRolesList()
      }
    },
    editRight (row) {
      this.isEditing = true
      // 数据回显
      this.editData.roleDesc = row.roleDesc
      this.editData.roleName = row.roleName
      this.editData.id = row.id
    },
    async define () {
      try {
        await this.$refs.editData.validate()
        const { meta } = await this.axios.put(`roles/${this.editData.id}`, this.editData)
        if (meta.status === 200) {
          this.$message.success('更新成功')
        }
        this.isEditing = false
      } catch (e) {
        this.$message.error('请输入角色名')
      }
    },
    async addRight () {
      try {
        await this.$refs.addData.validate()
        const { meta } = await this.axios.post('roles', this.addData)
        console.log(meta)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addShow = false
          this.getRolesList()
          this.$refs.addData.resetFields()
        }
      } catch (e) {
        this.$message.error('请输入角色名')
      }
    }
  }
}
</script>

<style lang="scss">
.roles {
  height: 100%;
  .bottom {
    border-bottom: 1px dotted #ccc;
    padding-top: 10px;
  }
  .el-tag {
    margin-bottom: 10px;
    margin-right: 5px;
  }
  .edit {
    background: url('../assets/325685_300.jpg') no-repeat center center/cover;
    float: right;
    margin-top: 10px;
    color: transparent;
    font-size: 40px;
    &:hover,
    &:focus,
    &:active {
      color: transparent;
    }
  }
}
</style>
