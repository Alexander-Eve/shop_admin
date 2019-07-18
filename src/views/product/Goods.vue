<template>
  <div class="goods">
     <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">活动管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="tableData"  style="width: 100%" v-loading="loading">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name" width="400"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot:default="{ row }">
          {{ row.add_time | dataFilter }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain circle size="small" icon="el-icon-edit"></el-button>
        <el-button type="danger" plain circle size="small" icon="el-icon-delete"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加按钮 -->
    <el-button class="diy" id="diy" @click="$router.push('/goods-add')">添加按钮</el-button>
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
      loading: true
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsList()
    },
    async getGoodsList () {
      this.loading = true
      const { meta, data } = await this.axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.tableData = data.goods
        this.total = data.total
      }
      this.loading = false
    },
    indexMethod (index) {
      return (this.pagenum - 1) * this.pagesize + index + 1
    }
  }
}
</script>

<style lang="scss">
.goods {
  height: 100%;
  #diy {
    background: url('../../assets/325328.jpg') no-repeat center center/cover;
    float: right;
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
