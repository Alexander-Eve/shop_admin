<template>
  <div class="goods-add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tabs标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleClick" tabPosition="left">
      <el-tab-pane label="基本信息" name="0">
        <el-form :model="form">
          <el-form-item label="商品名称" label-width="80px">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" label-width="80px">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" label-width="80px">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" label-width="80px">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" label-width="80px">
            <el-cascader
              v-model="form.goods_cat"
              :options="options"
              :props="props">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销" label-width="80px">
            <el-radio v-model="form.radio" label="1">是</el-radio>
            <el-radio v-model="form.radio" label="2">否</el-radio>
          </el-form-item>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="returnUrl"
          :headers="headers">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <quill-editor v-model="form.goods_introduce">
        </quill-editor>
        <el-button type="primary" @click="addCategory">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogImageUrl: '',
      dialogVisible: false,
      props: {
        label: 'cat_name',
        value: 'cat_id'
      },
      options: [],
      activeName: '0',
      form: {
        pic: []
      },
      active: 0
    }
  },
  async created () {
    const { meta, data } = await this.axios.get('categories')
    if (meta.status === 200) {
      this.options = data
    }
  },
  methods: {
    handleClick (tab, event) {
      this.active = +tab.index
    },
    next () {
      this.active++
      this.activeName = '' + this.active
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    returnUrl (res, file, fileList) {
      if (res.meta.status === 200) {
        this.form.pic.push({ pic: res.data.tmp_path })
      }
    },
    async addCategory () {
      const { meta } = await this.axios.post('goods', {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      })
      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.$router.push('goods')
      } else {
        this.active = 0
        this.activeName = '0'
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss">
.goods-add {
  height: 100%;
  .el-form-item__label,
  .el-tabs__item,
  .el-radio__label {
    font-weight: 700;
    opacity: .7;
  }
  .quill-editor {
    opacity: .8;
    .ql-editor {
      height: 200px;
    }
  }
}
</style>
